import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle";
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("role").default("user"),
  customerID: text("customerID"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  created: timestamp("created").defaultNow(),
});

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});
//relation
//one product can have many variants
export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "product_reviews" }),
}));

//one variant can have many images and tags; variant can only associate to one product
export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    //one to one relation with product
    product: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: "productVariants",
    }),
    //one to many relation with images
    variantImages: many(variantImages, {
      relationName: "variantImages",
    }),
    //one to many relation with tags
    variantTags: many(variantTags, {
      relationName: "variantTags",
    }),
  })
);

//variantImages relation
export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: "variantImages",
  }),
}));

//variantTags relation
export const variantTagsRelation = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: "variantTags",
  }),
}));

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),

    userID: text("userID")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productID: serial("productID")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    created: timestamp("created").defaultNow(),
    comment: text("comment").notNull(),
  },
  (table) => [
    index("productIdx").on(table.productID),
    index("userIdx").on(table.userID),
  ]
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "product_reviews",
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
  orders: many(orders, { relationName: "user_orders" }),
}));

//orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
  paymentIntentID: text("paymentIntentID"),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderProducts: many(orderProducts, { relationName: "orderProduct" }),
}));

export const orderProducts = pgTable("orderProducts", {
  id: serial("id").primaryKey(),
  orderID: serial("orderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productVariantID: serial("productVariantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
  order: one(orders, {
    fields: [orderProducts.orderID],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProducts.productID],
    references: [products.id],
    relationName: "products",
  }),
  productVariants: one(productVariants, {
    fields: [orderProducts.productVariantID],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));
