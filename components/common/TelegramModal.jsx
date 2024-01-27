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
import { z } from "zod";

const TelegramModal = ({ channel, type, userId }) => {
  const initialValues =
    channel && type === "Update"
      ? {
          ...channel,
        }
      : { socialId: "" };

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        socialId: z.string().optional(),
      })
    ),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    if (type === "Update") {
      if (!channel) {
        router.back();
        return;
      }

      try {
        const updatedSocialAuth = await updateSocialAuth({
          data: { ...values, _id: channel._id },
          userId,
          socialPlatform: "telegram-channel",
        });

        if (updatedSocialAuth) {
          toast.success("Channel updated succesfully.");
          form.reset();
          router.push(`/profile`);
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
          socialPlatform: "telegram-channel",
        });

        if (newToken) {
          toast.success("Channel added succesfully.");
          form.reset();
          router.push(`/profile`);
        }
      } catch (error) {
        toast.error("Error adding channel");
        console.log(error);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <FaPlus size={24} className="text-gray-400" />
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-600">
        <DialogHeader>
          <DialogTitle>Telegram Channel ID</DialogTitle>
          <DialogDescription>
            Please click here on how to get your channel ID
            {/* TODO add a link to instructions here */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="socialId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Telegram Channel ID (Begins with -100)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Telegram Channel ID"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Connect Channel</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramModal;
