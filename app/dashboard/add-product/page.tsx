import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import ProductForm from "./product-form";

export default async function AddProduct() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect("/dashboard/settings");
  }
  return <ProductForm />;
}
