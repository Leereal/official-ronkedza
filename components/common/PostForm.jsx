"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFormSchema } from "@/lib/validator";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { postDefaultValues } from "@/constants";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";
import { createPost, updatePost } from "@/lib/actions/post.actions";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { postToSocials } from "@/lib/actions/socialPost.actions";

const PostForm = ({ userId, type, post, postId }) => {
  const [files, setFiles] = useState([]);
  const initialValues =
    post && type === "Update"
      ? {
          ...post,
          scheduled_time: new Date(post.scheduled_time),
          categoryId: post.category._id,
        }
      : postDefaultValues;
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === "Create") {
      try {
        const newPost = await createPost({
          post: { ...values, featured_image: uploadedImageUrl },
          userId,
          path: "/profile",
        });

        if (newPost) {
          postToSocials(newPost);
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
          post: { ...values, featured_image: uploadedImageUrl, _id: postId },
          path: `/posts/${postId}`,
        });

        if (updatedPost) {
          form.reset();
          router.push(`/posts/${updatedPost._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
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
              <FormItem className="w-full md:w-2/3">
                <FormLabel>Content</FormLabel>
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Enter Content Here..."
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured_image"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3">
                <FormLabel>Featured Image</FormLabel>
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row items-center">
          <FormField
            control={form.control}
            name="scheduled_time"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <FaCalendarAlt className="text-grey-500" />

                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Schedule Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="w-1/2 md:w-1/3">
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
          <FormField
            control={form.control}
            name="is_scheduled"
            render={({ field }) => (
              <FormItem className="w-1/2 md:w-1/3">
                <FormControl>
                  <div className="flex items-center justify-center">
                    <label
                      htmlFor="is_scheduled"
                      className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Scheduled
                    </label>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id="is_scheduled"
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
