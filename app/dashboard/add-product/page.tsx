import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProductForm from "./product-form";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function AddProduct() {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return <ProductForm />;
}
