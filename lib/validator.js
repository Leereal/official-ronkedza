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
