"use client";

import { useSearchParams } from "next/navigation";

import { verifyEmailToken } from "@/server/action/token";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import { useRouter } from "next/navigation";

export const EmailVerificationForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //run this fn only once when component mounts
  const handleVerification = useCallback(async () => {
    //this fn will only runs once so check if error or success is already set
    if (error || success) return;
    //if no token is passed
    if (!token) {
      setError("No token found");
      return;
    }
    //verify token
    console.log("Verifying token");

    const response = await verifyEmailToken(token);
    console.log(response);

    if (response.error) {
      setError(response.error);
      return;
    }
    setSuccess("Email verified successfully");
    // redirect to login page after 2 sec
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  }, []);
  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      cardtitle="Verifying email"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col justify-center w-full">
        <p>{!success && !error ? "Verifying Email...." : null}</p>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </div>
    </AuthCard>
  );
};
