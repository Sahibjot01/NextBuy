import { db } from "@/server";
import placeholder from "@/public/placeholder.png";
import { DataTable } from "./data-table";
import { columns } from "./column";
export default async function Producs() {
  //fetch products
  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: { variantImages: true, variantTags: true },
        orderBy: (productVariants, { asc }) => [asc(productVariants.id)],
      },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("No products found");

  //create a datatable
  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }
    //get first variant image
    const firstImage = product.productVariants[0].variantImages[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image: firstImage,
      variants: product.productVariants,
    };
  });
  if (!dataTable) throw new Error("No data found");
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
