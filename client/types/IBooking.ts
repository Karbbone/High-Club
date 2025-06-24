import { Ticket } from "@/types/ITicket";
import { User } from "@/types/IUser";
import { Event } from "@/types/IEvent";

export interface Booking {
  id: number;
  datetime: string;
  tickets?: Ticket[];
  user?: User;
  event?: Event;
  createdAt: string;
  updatedAt: string;
}