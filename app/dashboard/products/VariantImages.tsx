"use client";

import { UploadDropzone } from "@/app/api/uploadthing/upload";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { variantSchema } from "@/types/variantSchema";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";

import { Reorder } from "motion/react";
import { useState } from "react";

export default function VariantImages() {
  const { getValues, control, setError } =
    useFormContext<z.infer<typeof variantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });
  //state for reorder
  const [active, setActive] = useState(0);
  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Variant title</FormLabel>
            <FormControl>
              <UploadDropzone
                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 
                hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:!bg-primary/75 
                ut-button:after:!bg-primary/40 ut-button:ut-uploading:bg-primary/10 "
                onUploadError={(error) => {
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={(files) => {
                  //uploadthing will give us files here which user have uploaded
                  //now we can map over them to save image data into our form field ie to save into db
                  files.map((file) =>
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    })
                  );

                  return files;
                }}
                onClientUploadComplete={(files) => {
                  //get images which are saved in
                  const images = getValues("variantImages");
                  images.map((field, imageIDX) => {
                    //if image url is blob url then we need to update it with the new url
                    if (field.url.search("blob:") === 0) {
                      //cleanup of blob url
                      URL.revokeObjectURL(field.url);

                      const image = files.find(
                        (img) => img.name === field.name
                      );
                      if (image) {
                        update(imageIDX, {
                          url: image.ufsUrl,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        });
                      }
                    }
                  });
                }}
                //to make auto uploading
                config={{ mode: "auto" }}
                endpoint="variantUploader"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[active];

              //e will be the new order of the elements after reorder
              //we need to find the index of the active element in the new order
              e.map((item, index) => {
                if (item === activeElement) {
                  //move the active element to the new index
                  move(active, index);
                  setActive(index);
                  return;
                }
                return;
              });
            }}
          >
            {fields.map((field, index) => {
              return (
                <Reorder.Item
                  as="tr"
                  key={field.id}
                  value={field}
                  onDragStart={() => setActive(index)}
                  className={cn(
                    field.url.search("blob:") === 0
                      ? "animate-pulse transition-all"
                      : "",
                    "text-sm font-bold text-muted-foreground hover:text-primary"
                  )}
                >
                  <TableCell>{index}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>
                    {(field.size / (1024 * 1024)).toFixed(2) + " MB"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Image
                        src={field.url}
                        alt={field.name}
                        className="rounded-md"
                        width={72}
                        height={48}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"ghost"}
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                      className="scale-75"
                    >
                      <TrashIcon className="h-4" />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}
