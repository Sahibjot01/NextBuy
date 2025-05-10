import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/server/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

//to get variants with all images and tags
export type variantWithImagesTags = InferResultType<
  "productVariants",
  {
    variantImages: true;
    variantTags: true;
  }
>;

//to get products with all variants
export type productsWithVariants = InferResultType<
  "products",
  {
    productVariants: true;
  }
>;

//to get variant with product, img, tag
export type variantsWithProduct = InferResultType<
  "productVariants",
  {
    variantImages: true;
    variantTags: true;
    product: true;
  }
>;

//to get all the reviews with user
export type reviewsWithUser = InferResultType<
  "reviews",
  {
    user: true;
  }
>;

//to get all the ordersProducts with product,variant

export type ordersProductsWithProductAndVariant = InferResultType<
  "orderProducts",
  {
    product: true;
    productVariants: {
      with: {
        variantImages: true;
      };
    };
  }
>;

export type ordersWithProductAndVaraint = InferResultType<
  "orders",
  {
    orderProducts: {
      with: {
        productVariants: {
          with: {
            variantImages: true;
          };
        };
        product: true;
      };
    };
  }
>;

//to get all the ordersProducts with product,variant,orders
export type totalOrders = InferResultType<
  "orderProducts",
  {
    order: {
      with: {
        user: true;
      };
    };
    product: true;
    productVariants: {
      with: {
        variantImages: true;
      };
    };
  }
>;
