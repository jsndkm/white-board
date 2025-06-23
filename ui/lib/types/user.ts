export type LoginResp = {
  id: number;
  token: string;
  expires_in: string;
  username: string;
};

export type RegisterResp = {
  token: string;
};
