import { db } from "@/server";
import placeholder from "@/public/placeholder.png";
import { DataTable } from "./data-table";
import { columns } from "./column";
export default async function Producs() {
  //fetch products
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("No products found");

  //create a datatable
  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image: placeholder.src,
      variants: [],
    };
  });
  if (!dataTable) throw new Error("No data found");
  return <DataTable columns={columns} data={dataTable} />;
}
