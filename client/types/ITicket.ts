import { Status } from "@/types/IStatus";
import { User } from "@/types/IUser";
import { Booking } from "@/types/IBooking";
import { Purchase } from "@/types/IPurchase";

export interface Ticket {
  id: number;
  qrcode_url: string;
  status?: Status;
  user?: User;
  booking?: Booking;
  purchases?: Purchase[];
  createdAt: string;
  updatedAt: string;
}