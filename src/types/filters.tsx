export interface PriceRangeFilter {
  min?: number;
  max?: number;
}

export interface Filters {
  priceRange?: PriceRangeFilter;
  propertyType?: string | string[];
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  area?: { min?: number; max?: number };
  featured?: string[];
}
