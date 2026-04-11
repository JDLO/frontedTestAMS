export interface Product {
  id: string;
  brand: string;
  model: string;
  price: number;
  imgUrl: string;
  cpu?: string;
  ram?: string;
  os?: string;
  displayResolution?: string;
  battery?: string;
  primaryCamera?: string[];
  secondaryCmera?: string[] | string;
  dimentions?: string;
  weight?: number;
  colors: string[];
  options: ProductOptions;
}

export interface ProductOptions {
  colors: Productption[];
  storages: Productption[];
}

export interface Productption {
  code: number;
  name: string;
}
