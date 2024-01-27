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
  is_published: z.boolean(),
  categoryId: z.string().min(3, {
    message: "Category is required",
  }),
  attachments: z.array(z.string()),
});

export const pageFormSchema = z.object({
  socialId: z.string().optional(),
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
