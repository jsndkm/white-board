export type ProjectInfo = {
  id: number;
  name: string;
  description: string;
  isAdmin: boolean;
};

export type GetProjectListResp = ProjectInfo[];
