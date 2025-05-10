"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { useState } from "react";
import AuthCard from "./auth-card";
import { ResetSchema } from "@/types/reset-schema";
import { PasswordReset } from "@/server/action/password-reset";

export default function ResetForm() {
  const { execute, status } = useAction(PasswordReset, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
        setSuccess("");
      }
      if (typeof data?.success == "string") {
        setError("");
        setSuccess(data.success);
      }
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardtitle="Forgot your password?"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="youremail@email.com"
                      {...field}
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button variant={"link"} size={"sm"} asChild>
              <Link href="/auth/reset">forgot Password</Link>
            </Button>
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full",
              status === "executing" ? "animate-pulse" : ""
            )}
          >
            {"login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
