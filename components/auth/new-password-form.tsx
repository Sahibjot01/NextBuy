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
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/action/new-password";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { execute, status } = useAction(newPassword, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (typeof data?.success == "string") {
        setSuccess(data.success);
      }
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({ ...values, token });
  };
  return (
    <AuthCard
      cardtitle="Enter your new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*********"
                      {...field}
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*********"
                      {...field}
                      type="password"
                      autoComplete="current-password"
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
            {"Reset Password"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
