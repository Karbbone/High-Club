import { User } from "@/types/IUser";

export interface Image {
  id: number;
  link: string;
  createdAt: string;
  updatedAt: string;
  users?: User[];
}