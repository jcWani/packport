"use server";

import { db } from "..";
import bcrypt from "bcrypt";
import { actionClient } from "@/lib/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    // Password is being hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Check if email is already in the database than say it's in use, if it's not register the user but also send the verification email
    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].token,
          verificationToken[0].email
        );

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    // When the user is not registered
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].token,
      verificationToken[0].email
    );

    return { success: "Confirmation email sent" };
  });
