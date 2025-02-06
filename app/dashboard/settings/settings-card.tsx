"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";
import { UploadButton } from "@/app/api/uploadthing/upload";

type SettingsForm = {
  session: Session;
};

export default function SettingsCard(session: SettingsForm) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  // console.log(session);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      image: session.session.user?.image || "/default-user.jpg",
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data.data?.success) {
        setError("");
        setSuccess(data.data?.success);
      }
      if (data.data?.error) {
        setSuccess("");
        setError(data.data?.error);
      }
    },
    onError: (error) => {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    // console.log(values);
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === "executing"}
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
                    {form.getValues("image") ? (
                      <Image
                        className="rounded-full aspect-square object-cover"
                        alt="User Image"
                        src={form.getValues("image")!}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <Avatar>
                        <AvatarImage src="/default-user.jpg" />
                      </Avatar>
                    )}
                    <UploadButton
                      className="scale-75 ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut-label:hidden ut-allowed-content:hidden ut-button:duration-500 ut:button:transition-all ut-button:ring-primary"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!);
                        setAvatarUploading(false);
                        return;
                      }}
                      endpoint="avatarUploader"
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar</div>;
                          return <div>Uploading...</div>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Image"
                      type="hidden"
                      disabled={status === "executing"}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
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
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {success && !error && <FormSuccess message={success} />}
            {error && !success && <FormError message={error} />}

            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
