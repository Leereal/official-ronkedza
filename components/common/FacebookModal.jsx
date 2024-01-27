"use client";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { pageFormSchema } from "@/lib/validator";
import { pageDefaultValues } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSocialAuth,
  updateSocialAuth,
} from "@/lib/actions/socialToken.actions";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const FacebookModal = ({ page, type, userId }) => {
  const initialValues =
    page && type === "Update"
      ? {
          ...page,
        }
      : pageDefaultValues;

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(pageFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    if (type === "Update") {
      if (!page) {
        router.back();
        return;
      }

      try {
        const updatedSocialAuth = await updateSocialAuth({
          data: { ...values, _id: page._id },
          userId,
        });

        if (updatedSocialAuth) {
          toast.success("Tokens updated succesfully.");
          form.reset();
          router.push(`/settings`);
        }
      } catch (error) {
        toast.error("Error updating token");
        console.log(error);
      }
    } else {
      try {
        const newToken = await createSocialAuth({
          data: values,
          userId,
        });

        if (newToken) {
          toast.success("Tokens added succesfully.");
          form.reset();
          router.push(`/settings`);
        }
      } catch (error) {
        toast.error("Error adding token");
        console.log(error);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <FaPlus size={24} className="text-gray-400" />
      </DialogTrigger>
      <DialogContent className="bg-white md:max-w-[60vw] dark:bg-slate-600">
        <DialogHeader>
          <DialogTitle>Facebook Token</DialogTitle>
          <DialogDescription>
            Please click here on how to get user short lived token
            {/* TODO add a link to instructions here */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              {/* <FormField
                control={form.control}
                name="pageId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Facebook Page ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Facebook Page ID"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="accessToken"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Facebook AccessToken</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Facebook User AccessToken"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Connect All Linked Pages</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FacebookModal;
