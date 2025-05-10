"use client";

import { variantWithImagesTags } from "@/lib/infer-type";
//for dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { variantSchema } from "@/types/variantSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputTags } from "./Input-tags";
import VariantImages from "./VariantImages";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/action/add-variant";
import { toast } from "sonner";
import { deleteVariant } from "@/server/action/delete-variant";

type ProductVariantProps = {
  editMode: boolean;
  productID: number;
  variant?: variantWithImagesTags;
  children: React.ReactNode;
};

export default function ProductVariant({
  editMode,
  productID,
  variant,
  children,
}: ProductVariantProps) {
  //state for to open and close dialog box
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productID,
      productType: "Black Notebook",
    },
  });

  //function to set form values if form is opened in edit state
  const setEdit = () => {
    if (!editMode) {
      form.reset();
      return;
    }
    if (editMode && variant) {
      form.reset();

      form.setValue("id", variant.id);
      form.setValue("color", variant.color);
      form.setValue("productID", variant.productID);
      form.setValue("productType", variant.productType);
      form.setValue(
        "tags",
        variant.variantTags.map((value) => value.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((value) => ({
          name: value.name,
          size: value.size,
          url: value.url,
        }))
      );
    }
  };

  useEffect(() => {
    if (open) {
      setEdit();
    }
  }, [open, variant]);

  const { execute, status } = useAction(createVariant, {
    onExecute() {
      if (editMode) {
        toast.loading("Updating Variant...", {
          id: "creating-product",
        });
      }
      if (!editMode) {
        toast.loading("Creating Variant...", {
          id: "creating-product",
        });
      }
      setOpen(false);
    },
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success, {
          id: "creating-product",
        });
      }
      if (data?.error) {
        toast.error(data.error, {
          id: "creating-product",
        });
      }
    },
    onError({ error }) {
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
  });

  const deleteVariantAction = useAction(deleteVariant, {
    onExecute() {
      toast.loading("Deleting Variant...", {
        id: "deleting-variant",
      });
      setOpen(false);
    },
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success, {
          id: "deleting-variant",
        });
      }
      if (data?.error) {
        toast.error(data.error, {
          id: "deleting-variant",
        });
      }
    },
    onError({ error }) {
      toast.error("Failed to delete variant", {
        id: "deleting-variant",
      });
    },
  });

  function onSubmit(values: z.infer<typeof variantSchema>) {
    console.log(values);
    execute(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[680px] rounded-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteVariantAction.execute({ id: variant.id });
                  }}
                  disabled={deleteVariantAction.status === "executing"}
                >
                  Delete this variant
                </Button>
              )}
              <Button
                type="submit"
                disabled={status === "executing" || !form.formState.isDirty}
              >
                {editMode ? "Update Variant" : "Create Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
