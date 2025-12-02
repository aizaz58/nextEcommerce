import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  brandId: string;
  featureImageURL: string;
  imageList: string[];
  stock: number;
  timestampCreate: Timestamp;
  categoryId: string;
  orders?:number
}

export interface OrderCountItem {
  date: string;
  data: {
    totalRevenue?: number;
    totalOrders?: number;
  };
}