"use client";

import LoginForm from "@/components/auth/login-form";
import AuthWrapper from "@/components/wrapper/auth-wrapper";

export default function Login() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
