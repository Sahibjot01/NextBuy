"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useSearchParams } from "next/navigation";
import { reviewSchema } from "@/types/reviews-schema";
import { Textarea } from "../ui/textarea";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { addReview } from "@/server/action/add-review";
import { toast } from "sonner";

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productID"));
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productID: productId,
      rating: 0,
      comment: "",
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error, {
          id: "adding-review",
        });
      }
      if (data?.success) {
        toast.success(`Review added Successfully`, {
          id: "adding-review",
        });
        form.reset();
      }
    },
    onError: (error) => {
      toast.error("Failed to add review", {
        id: "adding-review",
      });
    },
    onExecute: () => {
      toast.loading("Adding review", {
        id: "adding-review",
      });
    },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    execute(values);
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your review here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="star Rating" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          key={value}
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          className="cursor-pointer relative"
                        >
                          <Star
                            key={value}
                            onClick={() => {
                              form.setValue("rating", value);
                            }}
                            className={cn(
                              "text-primary bg-transparent transition-all duration-300 ease-in-out",
                              value <= form.getValues("rating")
                                ? "fill-primary"
                                : "fill-muted"
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={status === "executing"}
              className="w-full"
              type="submit"
            >
              {status === "executing" ? "Adding Review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
