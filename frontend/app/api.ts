import axios from "axios";
import type { GetUsersResponse, UserActionResponse, UserLoginRequest, UserLoginResponse } from "./types";

const base_url = `${import.meta.env.VITE_BASE_URL}/api`;

export function login(cred: UserLoginRequest) {
  const res = axios.post<UserLoginResponse>(`${base_url}/users/login`, cred);
  return res;
}


export function getUsers(userId: string): Promise<GetUsersResponse> {
  const res = axios.get(`${base_url}/users`, {
    headers: {
      "UserId": userId,
    },
  });
  return res.then((response) => response.data);
}


export function deleteUsers(userIds: string[], userId: string): Promise<UserActionResponse> {
  const res = axios.delete(`${base_url}/users`, {
    headers: {
      "UserId": userId,
    },
    data: {
      targetUserIds: userIds,
    },
  });
  return res.then((response) => response.data);
}