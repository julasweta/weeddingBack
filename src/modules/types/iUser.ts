import { Role } from "@prisma/client";


export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  isConfirmed: boolean;
}
