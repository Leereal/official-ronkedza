"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { postFormSchema } from "@/lib/validator";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { postDefaultValues } from "@/constants";
import { useEffect, useState } from "react";
import Dropdown from "@/components/common/Dropdown";
import { createPost, updatePost, repostPost } from "@/lib/actions/post.actions";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { MultiSelect } from "react-multi-select-component";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MultipleFileUploader } from "./MultipleFileUploader";
import SchedulePicker from "./SchedulePicker";
import moment from "moment";
import { FaTrash } from "react-icons/fa6";
import { getSocialTokensByUser } from "@/lib/actions/socialToken.actions";

const PostForm = ({ userId, type, post, postId, closeModal }) => {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allPostSchedules, setAllPostSchedules] = useState([]);
  const [socialTokens, setSocialTokens] = useState([]);

  const initialValues =
    post && (type === "Update" || type === "Repost")
      ? {
          ...post,
          categoryId: post.category._id,
        }
      : postDefaultValues;
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (error) => {
      console.log("error occurred while uploading: ", error);
    },
    onUploadBegin: () => {
      console.log("upload has begun");
    },
  });

  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    let uploadedImageUrls = values.attachments;

    if (files.length > 0) {
      console.log("Files : ", files);
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrls = uploadedImages.map((image) => image.url);
    }

    if (type === "Create") {
      try {
        const newPost = await createPost({
          post: { ...values, attachments: uploadedImageUrls },
          userId,
          path: "/profile",
          socialPlatforms: selected.length ? selected : null,
          schedulingData: allPostSchedules.length ? allPostSchedules : null,
        });
        if (newPost) {
          form.reset();
          router.push(`/posts/${newPost._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!postId) {
        router.back();
        return;
      }

      try {
        const updatedPost = await updatePost({
          userId,
          post: { ...values, attachments: uploadedImageUrls, _id: postId },
          path: `/posts/${postId}`,
          socialPlatforms: selected.length ? selected : null,
          schedulingData: allPostSchedules.length ? allPostSchedules : null,
        });

        if (updatedPost) {
          form.reset();
          router.push(`/posts/${updatedPost._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Repost") {
      if (!postId) {
        router.back();
        return;
      }

      try {
        const repostedPost = await repostPost({
          userId,
          post: { ...post, ...values },
          path: `/posts/${postId}`,
          socialPlatforms: selected.length ? selected : null,
          schedulingData: allPostSchedules.length ? allPostSchedules : null,
        });

        if (repostedPost) {
          form.reset();
          router.push(`/posts/${repostedPost._id}`);
          closeModal();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  const removeSchedule = (idx) => {
    const newPostSchedules = allPostSchedules.filter(
      (x, index) => index !== idx
    );
    setAllPostSchedules(newPostSchedules);
  };

  // Inside the useEffect where you fetch social tokens
  useEffect(() => {
    const getSocials = async () => {
      try {
        const socialTokenList = await getSocialTokensByUser({
          userId,
          page: 1,
        });
        if (socialTokenList) {
          // Transform the data to match the format expected by react-multi-select-component
          const transformedSocials = socialTokenList.data.map(
            (socialToken) => ({
              label: `${socialToken.socialPlatform.name}${
                socialToken.name ? " | " + socialToken.name : ""
              }`, // Assuming 'name' is the label in your model
              value: socialToken._id, // Assuming '_id' is the value in your model
              disabled: !socialToken.active, // You can set this based on your logic
              ...socialToken,
            })
          );
          setSocialTokens(transformedSocials);
        }
      } catch (error) {
        console.log("Error fetching social tokens:", error);
      }
    };

    getSocials();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="socialTokens">
            {!!socialTokens.length ? (
              "Choose socials where you want to share your content"
            ) : (
              <span className="text-red-400">
                Please connect your socials if you want to post
              </span>
            )}
          </Label>
          <div className="gap-3 flex flex-wrap">
            {!!selected.length &&
              selected.map((item) => (
                <Badge className="w-fit whitespace-nowrap" key={item.label}>
                  {item.label}
                </Badge>
              ))}
          </div>
          {!!socialTokens.length && (
            <MultiSelect
              options={socialTokens}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          )}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Post Title"
                    {...field}
                    className="input-field"
                    disabled={type === "Repost"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                    disabled={type === "Repost"}
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
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Content</FormLabel>
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Enter Content Here..."
                    {...field}
                    className="textarea rounded-2xl"
                    disabled={type === "Repost"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="featured_image"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3">
                <FormLabel>Featured Image</FormLabel>
                <FormControl className="h-72">
                  <MultipleFileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                    disabled={type === "Repost"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row items-center">
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Attachments (First image will be used as the cover | 5 Images
                  Max)
                </FormLabel>
                <FormControl>
                  <MultipleFileUploader
                    onFieldChange={field.onChange}
                    imageUrls={field.value}
                    files={files}
                    setFiles={setFiles}
                    disabled={type === "Repost"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row items-center">
          {allPostSchedules.map((schedule, index) => (
            <p className="text-[0.65rem] text-green-900 flex gap-2" key={index}>
              <span className="capitalize font-bold">
                {schedule.recurrence === "once" || schedule.recurrence === ""
                  ? "once"
                  : schedule.recurrence}
              </span>
              :{" "}
              {moment(schedule.startDateTime).format("dddd, D MMMM YYYY h:mmA")}
              {schedule.endDateTime
                ? ` to ${moment(schedule.endDateTime).format(
                    "dddd, D MMMM YYYY h:mmA"
                  )}`
                : ""}{" "}
              <span>
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeSchedule(index)}
                />
              </span>
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-5 md:flex-row items-center">
          <FormField
            control={form.control}
            name="scheduled_time"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/3">
                <FormControl>
                  <SchedulePicker
                    allPostSchedules={allPostSchedules}
                    setAllPostSchedules={setAllPostSchedules}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="w-1/2 lg:w-1/3">
                <FormControl>
                  <div className="flex items-center justify-center">
                    <label
                      htmlFor="is_published"
                      className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Publish
                    </label>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id="is_published"
                      className="mr-2 h-5 w-5 border-2 border-primary-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PostForm;
