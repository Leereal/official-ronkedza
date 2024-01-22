"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { socialPlatformFormSchema } from "@/lib/validator";
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
import { socialPlatformDefaultValues } from "@/constants";
import { useRouter } from "next/navigation";
import {
  createSocialPlatform,
  updateSocialPlatform,
} from "@/lib/actions/socialPlatform.actions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const SocialPlatformForm = ({ type, socialPlatform, socialPlatformId }) => {
  const initialValues =
    socialPlatform && type === "Update"
      ? socialPlatform
      : socialPlatformDefaultValues;
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(socialPlatformFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    if (type === "Create") {
      try {
        const newSocialPlatform = await createSocialPlatform({
          socialPlatform: values,
          path: "/admin-settings",
        });

        if (newSocialPlatform) {
          toast.success("Social Platform added successfully");
          form.reset();
          router.push(`/admin-settings`);
        }
      } catch (error) {
        toast.error("There was an error creating new platform");
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!socialPlatformId) {
        router.back();
        return;
      }

      try {
        const updatedSocialPlatform = await updateSocialPlatform({
          socialPlatform: { ...values, _id: socialPlatformId },
          path: `/admin-settings`,
        });

        if (updatedSocialPlatform) {
          toast.success("Social Platform updated successfully");
          form.reset();
          router.push(`/admin-settings`);
        }
      } catch (error) {
        toast.error("There was an error updating platform");
        console.log(error);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type} Platform </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Platform Name"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Slug (lower case and separated by -)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Slug"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>App ID / Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="App ID / Key"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appSecret"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>App Secret</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="App Secret"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>End Point / URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="End Point / URL"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SocialPlatformForm;
