"use client";

import { useForm } from "react-hook-form";
import AuthCard from "./auth-card";
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
import { RegisterSchema } from "@/types/register-schema";
import * as z from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { emailRegister } from "@/server/action/email-register";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export default function RegisterForm() {
  const { execute, status, result } = useAction(emailRegister, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    },
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardtitle="Create an Account"
      backButtonHref="/auth/login"
      backButtonLabel="Have an Account? Login"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} type="text" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      autoComplete="current-email"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button variant={"link"} size={"sm"} className="px-0" asChild>
              <Link href="/auth/reset">forgot Password</Link>
            </Button>
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full mt-4",
              status === "executing" ? "animate-pulse" : ""
            )}
          >
            {"Sign Up"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
