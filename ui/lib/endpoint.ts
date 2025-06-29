const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const API = {
  auth: {
    register: `${BASE_URL}/api/register`,
    login: `${BASE_URL}/api/login`,
    logout: `${BASE_URL}/api/logout`,
  },

  projects: {
    list: `${BASE_URL}/api/project-list`,
    detail: (id: number) => `${BASE_URL}/api/projects/${id}`,
    create: `${BASE_URL}/api/projects`,
    update: (id: number) => `${BASE_URL}/api/projects/${id}`,
    delete: (id: number) => `${BASE_URL}/api/projects/${id}`,
    invite: (projectId: number, username: string) =>
      `${BASE_URL}/api/projects/join?project_id=${projectId}&username=${username}`,
    exit: (projectId: number) =>
      `${BASE_URL}/api/projects/exit?project_id=${projectId}`,
    deleteMember: (projectId: number, username: string) =>
      `${BASE_URL}/api/projects/kick?project_id=${projectId}&username=${username}`,
  },

  board: {
    getScene: (projectId: number) =>
      `${BASE_URL}/api/project-board/${projectId}`,
    updateScene: (projectId: number) =>
      `${BASE_URL}/api/project-board/${projectId}`,
  },
};
