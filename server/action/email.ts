"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

// ✅ reusable email template
const emailTemplate = ({
  title,
  message,
  ctaText,
  ctaLink,
}: {
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
}) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #3b82f6;">${title}</h2>
      <p>${message}</p>
      ${
        ctaLink
          ? `<a href="${ctaLink}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">${ctaText}</a>`
          : ""
      }
      <p style="margin-top: 40px; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} NextBuy</p>
    </div>
  `;
};

const FROM_EMAIL = "NextBuy <no-reply@nextbuyapp.store>";

// 2FA Email
export const sendTwoFactorEmail = async (
  email: string,
  verificationToken: string
) => {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "NextBuy - Your 2FA Code",
    html: emailTemplate({
      title: "Your 2FA Code",
      message: `Your 2FA code is <strong>${verificationToken}</strong>. Please enter this code to continue.`,
    }),
  });

  if (error) console.error(error);
  return data;
};

// Email Verification
export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const confirmationLink = `${domain}/auth/new-verification?token=${verificationToken}`;
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "NextBuy - Verify Your Email",
    html: emailTemplate({
      title: "Verify Your Email",
      message: `Click the button below to verify your email address and activate your NextBuy account.`,
      ctaText: "Verify Email",
      ctaLink: confirmationLink,
    }),
  });

  if (error) console.error(error);
  return data;
};

// Password Reset
export const sendPasswordResetEmail = async (
  email: string,
  verificationToken: string
) => {
  const resetLink = `${domain}/auth/new-password?token=${verificationToken}`;
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "NextBuy - Reset Your Password",
    html: emailTemplate({
      title: "Reset Your Password",
      message: `It seems like you requested a password reset. Click the button below to reset your password.`,
      ctaText: "Reset Password",
      ctaLink: resetLink,
    }),
  });

  if (error) console.error(error);
  return data;
};
