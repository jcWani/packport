"use server";

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { db } from "..";
import { newPasswordSchema } from "@/types/new-password-schema";
import { actionClient } from "@/lib/safe-action";
import { getPasswordResetTokenByToken } from "./tokens";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import bcrypt from "bcrypt";

export const newPassword = actionClient
  .schema(newPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const dbPool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPooll = drizzle({ client: dbPool });

    // TO CHECK THE TOKEN
    if (!token) return { error: "Missing Token" };

    // CHECK if token is valid
    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) return { error: "Token not found" };

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) return { error: "Token has expired" };

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) return { error: "User not found" };

    const hashedPassword = await bcrypt.hash(password, 10);

    // TRANSACTIONS
    await dbPooll.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });

    return { success: "Password updated" };
  });
