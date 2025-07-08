const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "ws://localhost:8080/ws";

export const API = {
  auth: {
    register: `${BASE_URL}/api/register`,
    login: `${BASE_URL}/api/login`,
    logout: `${BASE_URL}/api/logout`,
  },

  template: {
    list: `${BASE_URL}/api/template-list`,
  },

  projects: {
    list: `${BASE_URL}/api/project-list`,
    simple: (id: number) => `${BASE_URL}/api/project-simple/${id}`,
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
    store: (projectId: number) => `${BASE_URL}/api/project-board/${projectId}`,
    getScene: (projectId: number) =>
      `${BASE_URL}/api/project-board/${projectId}`,
    updateScene: (projectId: number) =>
      `${BASE_URL}/api/project-board/${projectId}`,
  },
  ai: {
    advice: `${BASE_URL}/api/ai-advice`,
  },
};
