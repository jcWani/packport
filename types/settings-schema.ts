import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.preprocess(
      (val) => (val === "/default-user.jpg" ? undefined : val),
      z.optional(z.string())
    ),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string()),
    password: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().min(8).optional()
    ),
    newPassword: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().min(8).optional()
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) return false;

      return true;
    },
    { message: "New password is required", path: ["newPassword"] }
  );
