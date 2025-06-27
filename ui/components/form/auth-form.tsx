import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useUserStore } from "@/stores/user";
import Form from "next/form";
import React from "react";

export function AuthForm({
  action,
  children,
  isRegister,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  isRegister: boolean;
}) {
  const resetStatus = useUserStore((state) => state.resetStatus);

  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="username"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          用户名
        </Label>

        <Input
          id="username"
          name="username"
          className="bg-muted text-md md:text-sm"
          type="text"
          placeholder="请输入用户名"
          autoComplete="username"
          required
          autoFocus
          onChange={resetStatus}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          密码
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          placeholder="请输入密码"
          required
          onChange={resetStatus}
        />
      </div>

      {isRegister && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="font-normal text-zinc-600 dark:text-zinc-400"
          >
            邮箱
          </Label>

          <Input
            id="email"
            name="email"
            className="bg-muted text-md md:text-sm"
            type="email"
            placeholder="请输入邮箱"
            required
            onChange={resetStatus}
          />
        </div>
      )}

      {isRegister && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="phone"
            className="font-normal text-zinc-600 dark:text-zinc-400"
          >
            密码
          </Label>

          <Input
            id="phone"
            name="phone"
            className="bg-muted text-md md:text-sm"
            type="text"
            placeholder="请输入电话"
            required
            onChange={resetStatus}
          />
        </div>
      )}

      {children}
    </Form>
  );
}
