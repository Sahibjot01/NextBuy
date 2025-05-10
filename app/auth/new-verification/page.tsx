import { EmailVerificationForm } from "@/components/auth/email-verification-form";
import AuthWrapper from "@/components/wrapper/auth-wrapper";

export default function NewVerification() {
  return (
    <AuthWrapper>
      <EmailVerificationForm />
    </AuthWrapper>
  );
}
