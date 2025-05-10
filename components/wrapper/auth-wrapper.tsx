import AuthImage from "@/public/auth-image.png";
import Image from "next/image";
export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-between h-full gap-20">
      <section className="hidden lg:flex flex-col justify-center items-center lg:w-6/12 2xl:w-7/12 h-full">
        <Image
          src={AuthImage}
          className="w-full h-full object-cover"
          alt="auth-image"
        />
        <h2 className="text-xl text-center">Tools to Study Smarter</h2>
        <h3 className="text-lg mt-2 text-center">
          From notes to sketches — everything you need to stay sharp and
          productive.
        </h3>
      </section>
      <section className="w-full lg:w-6/12 2xl:w-5/12 flex  justify-center items-center ">
        {children}
      </section>
    </main>
  );
}
