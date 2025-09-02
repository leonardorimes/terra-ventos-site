export interface Property {
  id: string; // uuid
  title: string | null; // pode ser null
  location: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: string[]; // opcional
  featured?: boolean; // opcional
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
}
