export const RegisterEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`;
export const LoginEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`;
export const LogoutEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`;

export const GetMyProjectListEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/project-list`;
export const GetProjectDetailEndpoint = (id: number) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`;
export const CreateProjectEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`;
export const DeleteProjectEndpoint = (id: number) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`;

export const InviteToJoinProjectEndpoint = (
  project_id: number,
  username: string,
) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/join?project_id=${project_id}&username=${username}`;
export const ExitProjectEndpoint = (project_id: number) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/exit?project_id=${project_id}`;

export const GetSceneEndpoint = (project_id: number) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/project-board/${project_id}`;
