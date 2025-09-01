export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[]; // alterado de imageUrl para images
  featured?: boolean;
  description: string;
}
