import { users_role } from "@prisma/client";

export interface FilteredUser {
  id: number;
  email: string;
  role: users_role;
}
