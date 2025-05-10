"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendTwoFactorEmail = async (
  email: string,
  verificationToken: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "NextBuy - Your 2FA code",
    html: `<p>your 2FA code is <strong>${verificationToken}</strong></p>`,
  });

  if (error) {
    return console.log(error);
  }

  if (data) {
    return data;
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const confirmationLink = `${domain}/auth/new-verification?token=${verificationToken}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "NextBuy - Verify your email",
    html: `<p>verify your email by clicking <a href="${confirmationLink}">here</a></p>`,
  });

  if (error) {
    return console.log(error);
  }

  if (data) {
    return data;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  verificationToken: string
) => {
  const confirmationLink = `${domain}/auth/new-password?token=${verificationToken}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "NextBuy - Reset your password",
    html: `<p>Change your password by clicking <a href="${confirmationLink}">here</a></p>`,
  });

  if (error) {
    return console.log(error);
  }

  if (data) {
    return data;
  }
};
