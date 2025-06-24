import { Ticket } from "@/types/ITicket";
import { Booking } from "@/types/IBooking";
import { Image } from "@/types/IImage";

export interface User {
  id: number;
  is_verified: boolean;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  fidelity_point: number;
  tickets?: Ticket[];
  bookings?: Booking[];
  image?: Image;
  createdAt: string;
  updatedAt: string | null;
}