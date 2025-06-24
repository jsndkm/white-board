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

  const status = useUserStore((state) => state.registerStatus);
  const username = useUserStore((state) => state.username);
  const register = useUserStore((state) => state.register);
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    if (status === "user_exists") {
      toast.error("用户名已存在");
    } else if (status === "failed") {
      toast.error("未知错误");
    } else if (status === "invalid_data") {
      toast.error("用户名或密码不符合要求");
    } else if (status === "success") {
      toast.success("注册成功");

      setIsSuccessful(true);
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (formData: FormData) => {
    await register(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">注册</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            输入用户名和密码创建用户
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultUsername={username}>
          <SubmitButton isSuccessful={isSuccessful}>注册</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            已经有账号？
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              登录
            </Link>
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
