import { API } from "@/lib/endpoint";
import { CreateProjectRespData } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(2).max(12),
  description: z.string().min(5).max(30),
});

export function useCreateProjectMutation() {
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      const validatedData = createProjectSchema.parse({
        name: name,
        description: description,
      });

      return await fetcher<CreateProjectRespData>(API.projects.create, {
        method: "POST",
        body: JSON.stringify({
          name: validatedData.name,
          description: validatedData.description,
        }),
      });
    },
    onSuccess: () => {
      toast.success("项目创建成功");
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        toast.error("输入不符合要求");
      } else {
        toast.error(error instanceof Error ? error.message : "未知错误");
      }
    },
  });
}
