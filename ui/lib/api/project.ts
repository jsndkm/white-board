import {
  DeleteProjectEndpoint,
  InviteToJoinProjectEndpoint,
} from "@/lib/api/endpoint";
import { fetcher } from "@/lib/utils";

// ============================== Get My Project List ==============================
export type Project = {
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
