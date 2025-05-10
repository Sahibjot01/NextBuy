"use client";

import { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormSuccess } from "@/components/auth/form-success";
import { useState } from "react";
import { updateUser } from "@/server/action/update-user";
import { useAction } from "next-safe-action/hooks";
import { FormError } from "@/components/auth/form-error";
import { UploadButton } from "@/app/api/uploadthing/upload";
//toast from shadcn/ui

export default function SettingsCard({ session }: { session: Session }) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  // console.log("session", session.user);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      email: session.user?.email || undefined,
      name: session.user?.name || undefined,
      image: session.user?.image || undefined,
      isTwoFactorEnabled: session.user?.istwoFactorEnabled || undefined,
      password: undefined,
      newPassword: undefined,
    },
  });
  const { execute, status } = useAction(updateUser, {
    //when this action run if we have any error we returning then we get that error from onSuccess
    //if we didnt able to run this server action or some server error then that error is catched in onError
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    },
    onError: (error) => {
      setError("Something went wrong");
    },
  });
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    console.log(values);
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={status === "executing"}
                      placeholder="John Doe"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        src={form.getValues("image")!}
                        alt="User Avatar"
                        width={42}
                        height={42}
                        className="rounded-full"
                      />
                    )}
                    <UploadButton
                      endpoint="avatarUploader"
                      className="scale-75 ut-allowed-content:hidden ut-button:!bg-primary/75 ut-button:hover:!bg-primary/100 ut-button:!text-primary-foreground ut-button:transition-all ut-button:duration-500"
                      onUploadBegin={() => setAvatarUploading(true)}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].ufsUrl);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ ready }) {
                          return (
                            <div>
                              {ready ? "Change Avatar" : "Uploading..."}
                            </div>
                          );
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      disabled={status === "executing"}
                      placeholder="User Image"
                      type="hidden"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old-Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        status === "executing" || session.user?.isOAuth === true
                      }
                      placeholder="*********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter your old password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New-Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        status === "executing" || session.user?.isOAuth === true
                      }
                      placeholder="*********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter your new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={
                        status === "executing" || session.user?.isOAuth === true
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Enable two factor authentication for added security.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update Your Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
