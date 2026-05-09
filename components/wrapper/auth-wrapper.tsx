import AuthImage from "@/public/auth-image.png";
import Image from "next/image";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-between h-full gap-20 animate-auth-main-enter">
      <section className="hidden lg:flex flex-col justify-center items-center lg:w-6/12 2xl:w-7/12 h-full motion-safe:animate-auth-media-enter">
        <Image
          src={AuthImage}
          className="w-full h-full object-cover"
          alt="auth-image"
        />
      </section>
      <section className="w-full lg:w-6/12 2xl:w-5/12 flex justify-center items-center motion-safe:animate-auth-form-enter">
        {children}
      </section>
    </main>
  );
}
