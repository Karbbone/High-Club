import { Ticket } from "@/types/ITicket";
import { Status } from "@/types/IStatus";
import { Product } from "@/types/IProduct";

export interface Purchase {
  id: number;
  ticket?: Ticket;
  status?: Status;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}
