"use client";

import { ProductSchema, zProductSchema } from "@/types/product-schema";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Tiptap from "@/components/form/Tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProduct } from "@/server/action/add-product";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/server/action/get-product";
import { useEffect } from "react";

export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });
  const router = useRouter();
  const id = useSearchParams().get("id");
  const editMode = id ? true : false;

  //call this fn if editMode is true in useEffect
  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);
      if (data.error) {
        toast.error(data.error, {
          id: "fetch-product",
        });
        router.push("/dashboard/products");
        return;
      }
      if (data.success) {
        // form.setValue("title", data.success.title);
        // form.setValue("description", data.success.description);
        // form.setValue("price", data.success.price);
        // form.setValue("id", data.success.id);
        form.reset({
          title: data.success.title,
          description: data.success.description,
          price: data.success.price,
          id: data.success.id,
        });
      }
    }
  };
  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(id!));
    }
  }, []);

  const { execute, status } = useAction(addProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success, {
          id: "creating-product",
        });
        router.push("/dashboard/products");
      }
      if (data?.error) {
        toast.error(data.error, {
          id: "creating-product",
        });
      }
    },
    onError: (error) => {
      if (!editMode) {
        toast.error("Failed to create product", {
          id: "creating-product",
        });
      }
      if (editMode) {
        toast.error("Failed to update product", {
          id: "creating-product",
        });
      }
    },
    onExecute: () => {
      if (!editMode) {
        toast.loading("Creating product...", {
          id: "creating-product",
        });
      }
      if (editMode) {
        toast.loading("Updating product...", {
          id: "creating-product",
        });
      }
    },
  });

  const onSubmit = (values: zProductSchema) => {
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Make changes to existing product"
            : "Add a brand new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Tiptap value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted  rounded-sm"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step={0.01}
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
