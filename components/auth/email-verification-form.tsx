"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const EmailVerificationForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useSearchParams().get("token");
  const router = useRouter();

  const handleVerification = useCallback(() => {
    if (success || error) return "";

    if (!token) {
      setError("No token found");
      return;
    }

    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      cardTitle="Verify Your account"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center flex-coll w-full justify-center">
        <p>{!success && !error ? "Verifying email..." : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};
