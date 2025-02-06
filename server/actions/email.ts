"use server";

import { Resend } from "resend";
import getBaseURL from "@/lib/base-url";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (token: string, email: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Packport - confirmation request",
    html: `<p>Click to <a href='${confirmLink}'>Confirm your email</a></p>`,
  });

  if (error) return error;
  if (data) return data;
};

export const sendPasswordResetEmail = async (token: string, email: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Packport - confirmation request",
    html: `<p>Click here <a href='${confirmLink}'>reset your password</a></p>`,
  });

  if (error) return error;
  if (data) return data;
};

export const sendTwoFactorTokenByEmail = async (
  token: string,
  email: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Packport - Your 2 Factor Token",
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });

  if (error) return error;
  if (data) return data;
};
