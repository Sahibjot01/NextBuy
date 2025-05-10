import RegisterForm from "@/components/auth/register-form";
import AuthWrapper from "@/components/wrapper/auth-wrapper";

export default function Register() {
  return (
    <AuthWrapper>
      <RegisterForm />
    </AuthWrapper>
  );
}
