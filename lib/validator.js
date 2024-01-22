import * as z from "zod";
export const postFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z
    .string()
    .min(3, {
      message: "Content must be at least 3 characters.",
    })
    .max(500, {
      message: "Content must be at most 500 characters.",
    }),
  featured_image: z.string().optional(),
  scheduled_time: z.date().optional(),
  is_published: z.boolean(),
  is_scheduled: z.boolean(),
  categoryId: z.string(),
});

export const pageFormSchema = z.object({
  pageId: z.string().min(3, {
    message: "Page ID must be at least 3 characters.",
  }),
  accessToken: z.string().min(3, {
    message: "Token must be at least 3 characters.",
  }),
});

export const socialPlatformFormSchema = z.object({
  name: z.string().min(3, {
    message: "Platform must be at least 3 characters.",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
  endpoint: z.string().optional(),
});
