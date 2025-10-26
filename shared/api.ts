/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/** Example response type for /api/demo */
export interface DemoResponse {
  message: string;
}

/** Product domain types */
export interface ProductDTO {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
  featured?: boolean;
}

export interface ProductsListResponse {
  items: ProductDTO[];
  total: number;
  categories: string[];
}
