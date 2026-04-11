export interface Product {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  cpu?: string;
  ram?: string;
  os?: string;
  screenResolution?: string;
  battery?: string;
  cameras?: string;
  dimensions?: string;
  weight?: number;
  colors: { code: string; name: string }[];
  storage: { code: string; name: string }[];
}