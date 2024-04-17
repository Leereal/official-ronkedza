"use client";
import { FaArrowsSpin, FaPlus, FaRecycle } from "react-icons/fa6";
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
import { tokenDefaultValues } from "@/constants";
import { tokenFormSchema } from "@/lib/validator";
import PlatformDropdown from "./PlatformDropdown";
import { useState } from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { Checkbox } from "@/components/ui/checkbox";
import PageDropdown from "./PageDropdown";

const TokenModal = ({ socialToken, type, userId }) => {
  const [socialPlatform, setSocialPlatform] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const initialValues =
    socialToken && type === "Update"
      ? {
          ...socialToken,
        }
      : tokenDefaultValues;

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    if (type === "Update") {
      if (!socialToken) {
        router.back();
        return;
      }

      try {
        const updatedSocialAuth = await updateSocialAuth({
          data: {
            ...socialToken,
            _id: socialToken._id,
            groups: groups,
          },
          userId,
          socialPlatform,
        });

        if (updatedSocialAuth) {
          toast.success("Social Token updated succesfully.");
          form.reset();
          setSocialPlatform(null);
          setAllGroups([]);
          setGroups([]);
          router.push(`/profile`);
        }
      } catch (error) {
        toast.error("Error updating token");
        console.log(error);
      }
    } else {
      try {
        const newToken = await createSocialAuth({
          data: { ...values, groups: groups },
          userId,
          socialPlatform,
        });

        if (newToken) {
          toast.success("Social Token added succesfully.");
          form.reset();
          setSocialPlatform(null);
          setAllGroups([]);
          setGroups([]);
          router.push(`/profile`);
        }
      } catch (error) {
        toast.error("Error adding channel");
        console.log(error);
      }
    }
  }

  const syncGroups = async () => {
    try {
      setIsSyncing(true);

      const url = `${socialPlatform.endpoint}/waInstance${form.getValues(
        "socialId"
      )}/getChats/${form.getValues("accessToken")}`;

      // Perform asynchronous operation, e.g., fetching data
      const response = await fetch(url);
      const data = await response.json();

      // Filter data based on the 'name' property these are groups only
      const filteredData = data.filter((item) => item.name);

      setAllGroups(filteredData);
    } catch (error) {
      console.error("Error syncing groups:", error);
    } finally {
      // Ensure that isSyncing is set to false, regardless of success or error
      setIsSyncing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <span className="rounded-2xl gap-2 flex bg-secondary px-2 py-1 text-white">
          <FaPlus size={20} className="" /> Add New
        </span>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-600">
        <DialogHeader>
          <DialogTitle>Create New Token</DialogTitle>
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
            <div className="flex flex-col gap-5">
              <Label>Social Platform</Label>
              <PlatformDropdown
                value={socialPlatform}
                setSocialPlatform={(e) => {
                  setSocialPlatform(e);
                  form.reset();
                }}
              />
            </div>
            {socialPlatform &&
              socialPlatform?.slug === "whatsapp-group" &&
              !allGroups.length && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="socialId"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Instance ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Instance ID"
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
                      name="accessToken"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Access Token</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Access Token"
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
                      name="link"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Link (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Group Link"
                              {...field}
                              className="input-field"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {socialPlatform.slug === "whatsapp-group" &&
                    form.getValues("socialId") &&
                    form.getValues("accessToken") && (
                      <span
                        variant="outline"
                        className="text-green-500 gap-2 flex-center w-fit self-center border-2 border-solid p-2 rounded-xl shadow-xl cursor-pointer"
                        disabled={isSyncing}
                        onClick={syncGroups}
                      >
                        {isSyncing ? (
                          <Spinner />
                        ) : (
                          <FaArrowsSpin className={cn(" text-green-400")} />
                        )}
                        Sync Groups
                      </span>
                    )}
                </>
              )}
            {socialPlatform?.slug === "whatsapp-group" &&
              !!allGroups.length && (
                <div className="space-y-3">
                  {allGroups?.map((item) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={groups?.some((group) => group.id === item.id)}
                        onCheckedChange={(checked) => {
                          setGroups((prevGroups) =>
                            checked
                              ? [...prevGroups, item]
                              : prevGroups.filter(
                                  (value) => value.id !== item.id
                                )
                          );
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            {socialPlatform?.slug === "facebook-page" && (
              <div className="flex flex-col gap-5">
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
            )}
            {socialPlatform?.slug === "telegram-channel" && (
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
            )}
            {socialPlatform?.slug === "twitter" && (
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Twitter Access Token</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Twitter Access Token"
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
                  name="socialId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Twitter Access Secret</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Twitter Access Secret"
                          {...field}
                          className="input-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {socialPlatform?.slug === "instagram-business" && (
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="socialId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Facebook Page To Connect</FormLabel>
                      <FormControl>
                        <PageDropdown
                          onChangeHandler={field.onChange}
                          value={field.value}
                          userId={userId}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {(socialPlatform?.slug !== "whatsapp-group" || !!groups.length) && (
              <Button type="submit">Connect Social</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TokenModal;
