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
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });
  const router = useRouter();
  const { execute, status } = useAction(addProduct, {
    onSuccess: ({ data }) => {
      console.log("data", data);
      if (data?.success) {
        toast.success("Product created successfully", {
          id: "creating-product",
        });
        router.push("/dashboard/products");
      }
      if (data?.error) {
        toast.error("Failed to create product", {
          id: "creating-product",
        });
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to create product", {
        id: "creating-product",
      });
    },
    onExecute: () => {
      toast.loading("Creating product...", {
        id: "creating-product",
      });
    },
  });

  const onSubmit = (values: zProductSchema) => {
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
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
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
