import { Booking } from "@/types/IBooking";
import { Image } from "@/types/IImage";

export interface Event {
  id: number;
  start_datetime: string;
  end_datetime: string;
  name: string;
  description: string;
  artist: string;
  bookings?: Booking[];
  images?: Image[];
  createdAt: string;
  updatedAt: string;
}