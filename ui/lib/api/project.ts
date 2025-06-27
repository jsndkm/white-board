import {
  CreateProjectEndpoint,
  DeleteProjectEndpoint,
  InviteToJoinProjectEndpoint,
} from "@/lib/api/endpoint";
import { fetcher } from "@/lib/api/index";
import { z } from "zod";

// ============================== Get My Project List ==============================
export type MyProjectListItem = {
  id: number;
  name: string;
  description: string;
  admin: boolean;
};

// ============================== Get Project Detail ==============================
export type ProjectDetail = {
  id: number;
  name: string;
  description: string;
  user: [
    {
      username: string;
      admin: boolean;
    },
  ];
};

// ============================== Create Project ==============================
const newProjectInfoSchema = z.object({
  name: z.string().min(2).max(12),
  description: z.string().min(5).max(30),
});

export const createProject = async (formData: FormData) => {
  try {
    const validatedData = newProjectInfoSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    return await fetcher<MyProjectListItem>(CreateProjectEndpoint, {
      method: "POST",
      body: JSON.stringify({
        name: validatedData.name,
        description: validatedData.description,
      }),
    });
  } catch (error) {
    throw error;
  }
};

// ============================== Delete Project ==============================
export const deleteProject = async (id: number) => {
  await fetcher<void>(DeleteProjectEndpoint(id), {
    method: "DELETE",
  });
};

// ============================== Invite To Join Project ==============================
export const inviteToJoinProject = async (
  project_id: number,
  username: string,
) => {
  await fetcher<void>(InviteToJoinProjectEndpoint(project_id, username), {
    method: "POST",
  });
};
