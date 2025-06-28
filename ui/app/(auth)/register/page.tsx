"use client";

import { register, RegisterActionState } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/form/auth-form";
import { SubmitButton } from "@/components/form/submit-button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("用户名已存在");
    } else if (state.status === "failed") {
      toast.error("未知错误");
    } else if (state.status === "invalid_data") {
      toast.error("用户名或密码不符合要求");
    } else if (state.status === "success") {
      toast.success("注册成功");

      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="bg-background flex h-dvh w-screen items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">注册</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            输入用户名和密码创建用户
          </p>
        </div>
        <AuthForm action={handleSubmit} isRegister={true}>
          <SubmitButton isSuccessful={isSuccessful}>注册</SubmitButton>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
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
