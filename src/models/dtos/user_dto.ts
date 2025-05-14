import { user_role } from "@prisma/client";

export interface UserRequest {
  email: string;
  password: string;
  role?: user_role;
}

export interface UserResponse {
  id: number;
  email: string;
  role: user_role;
}
