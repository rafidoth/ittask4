import axios from "axios";
import type { UserLoginRequest, UserLoginResponse } from "./types";

const base_url = `${import.meta.env.VITE_BASE_URL}/api`;
console.log(base_url);

export function login(cred: UserLoginRequest) {
  const res = axios.post<UserLoginResponse>(`${base_url}/users/login`, cred);
  console.log(res);
  return res;
}
