export enum UserStatus {
  Unverified = "Unverfied",
  Blocked = "Blocked",
  Active = "Active",
}

export type User = {
  id: string;
  name: string;
  organization_Affiliation?: string;
  email: string;
  status?: UserStatus;
  activitesInMinutes?: { [date: string]: number };
  lastSeen?: string;
  lastLogin?: string;
  createdAt?: Date;
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

export type GetUsersResponse = {
  success: boolean;
  users: User[];
};


export type UserActionResponse = {
  success: boolean;
  message: string;
};