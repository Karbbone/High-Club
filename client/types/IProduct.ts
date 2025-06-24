import { Purchase } from "@/types/IPurchase";
import { Image } from "@/types/IImage";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  purchases?: Purchase[];
  images?: Image[];
  createdAt: string;
  updatedAt: string;
}