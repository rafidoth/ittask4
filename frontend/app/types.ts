export enum UserStatus {
  Unverified = "unverfied",
  Blocked = "blocked",
  Active = "active",
}

export type User = {
  id: string;
  name: string;
  organizational_affiliation: string;
  email: string;
  status?: UserStatus;
  last_seen?: string;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserLoginResponse = {
  success: boolean;
  userId: string;
  name: string;
  email: string;
  organization_Affiliation?: string;
};
