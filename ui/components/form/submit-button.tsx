"use client";

import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  isSuccessful,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending || isSuccessful}
      disabled={pending || isSuccessful}
      className="relative cursor-pointer"
    >
      {children}

      {(pending || isSuccessful) && (
        <span className="absolute right-4 animate-spin">
          <Loader />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
