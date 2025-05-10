import { EmailVerificationForm } from "@/components/auth/email-verification-form";
import AuthWrapper from "@/components/wrapper/auth-wrapper";
import { Suspense } from "react";
export default function NewVerification() {
  return (
    <AuthWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <EmailVerificationForm />
      </Suspense>
    </AuthWrapper>
  );
}
