"use client";
import ResetForm from "@/components/auth/reset-form";
import AuthWrapper from "@/components/wrapper/auth-wrapper";

export default function reset() {
  return (
    <AuthWrapper>
      <ResetForm />
    </AuthWrapper>
  );
}
