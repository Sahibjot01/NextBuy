import NewPasswordForm from "@/components/auth/new-password-form";
import AuthWrapper from "@/components/wrapper/auth-wrapper";
import { Suspense } from "react";
export default function NewPassword() {
  return (
    <AuthWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <NewPasswordForm />
      </Suspense>
    </AuthWrapper>
  );
}
