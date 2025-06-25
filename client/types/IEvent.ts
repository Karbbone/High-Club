import { Booking } from "@/types/IBooking";
import { Image } from "@/types/IImage";

export interface Event {
  id: number;
  startDatetime: string;
  endDatetime: string;
  name: string;
  description: string;
  artist: string;
  bookings?: Booking[];
  images?: Image[];
  createdAt: string;
  updatedAt: string;
}