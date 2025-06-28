export type CreateProjectRespData = {
  id: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  admin: boolean;
};

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
