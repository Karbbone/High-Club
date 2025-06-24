import { Purchase } from "@/types/IPurchase";
import { Ticket } from "@/types/ITicket";

export interface Status {
  id: number;
  name: string;
  purchases?: Purchase[];
  tickets?: Ticket[];
  createdAt: string;
  updatedAt: string;
}