"use server";

import { actionClient } from "@/lib/safe-action";
import { ResetSchema } from "@/types/reset-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) return { error: "User not found" };

    const passwordResetTokens = await generatePasswordResetToken(email);

    if (!passwordResetTokens) return { error: "Token not generated" };

    await sendPasswordResetEmail(
      passwordResetTokens[0].token,
      passwordResetTokens[0].email
    );

    return { success: "Reset Email Sent" };
  });
