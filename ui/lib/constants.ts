export const ENDPOINT = {
  Register: `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
  Login: `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
  Logout: `${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`,

  GetProjectList: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project-list`,
  CreateProject: `${process.env.NEXT_PUBLIC_BASE_URL}/api/new-project`,
  DeleteProject: (id: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/delete-project?project_id=${id}`,
};
