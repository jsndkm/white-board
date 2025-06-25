"use client";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { useGuestRedirect } from "@/hooks/use-guest-redirect";
import { useUserStore } from "@/stores/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  useGuestRedirect();

  const router = useRouter();

  const status = useUserStore((state) => state.loginStatus);
  const username = useUserStore((state) => state.username);
  const login = useUserStore((state) => state.login);
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    if (status === "failed") {
      toast.error("未知错误");
    } else if (status === "invalid_data") {
      toast.error("账号或密码错误");
    } else if (status === "success") {
      setIsSuccessful(true);
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (formData: FormData) => {
    await login(formData);
  };

  return (
    <div className="bg-background flex h-dvh w-screen items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">登录</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            使用用户名和密码登录
          </p>
        </div>
        <AuthForm
          action={handleSubmit}
          defaultUsername={username}
          isRegister={false}
        >
          <SubmitButton isSuccessful={isSuccessful}>登录</SubmitButton>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
            还没有账号？
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              注册
            </Link>
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
