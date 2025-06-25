import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useProjectStore } from "@/stores/project";
import Form from "next/form";
import React from "react";

export function NewProjectForm({
  action,
  children,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
}) {
  const resetStatus = useProjectStore((state) => state.resetStatus);

  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex w-[320px] flex-col gap-2">
        <Label
          htmlFor="name"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          名称
        </Label>

        <Input
          id="name"
          name="name"
          className="bg-muted text-md md:text-sm"
          type="text"
          required
          autoFocus
          defaultValue=""
          onChange={resetStatus}
        />
      </div>

      <div className="flex w-[320px] flex-col gap-2">
        <Label
          htmlFor="description"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          描述
        </Label>

        <Input
          id="description"
          name="description"
          className="bg-muted text-md md:text-sm"
          type="text"
          required
          onChange={resetStatus}
        />
      </div>
      {children}
    </Form>
  );
}
