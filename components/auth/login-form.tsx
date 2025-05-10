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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { emailSignin } from "@/server/action/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { useState } from "react";

export default function LoginForm() {
  const { execute, status, result } = useAction(emailSignin, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (typeof data?.success == "string") {
        setSuccess(data.success);
      }
      if (data?.twoFactor) setShowTwoFactorForm(true);
    },
  });
  // console.log(execute, status, result);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardtitle="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new Account"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {showTwoFactorForm && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      We have sent you a two factor code to your email
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        disabled={status === "executing"}
                        maxLength={6}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactorForm && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={status === "executing"}
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
                          disabled={status === "executing"}
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
              </>
            )}
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button variant={"link"} className="px-0" size={"sm"} asChild>
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
            {showTwoFactorForm ? "Verify" : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
