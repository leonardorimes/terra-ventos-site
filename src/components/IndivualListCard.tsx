// components/PropertyCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Square } from "lucide-react";
import { useState } from "react";

// Definir a interface diretamente no componente para evitar problemas de import
export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 group/heart"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorited
                ? "text-red-500 fill-red-500"
                : "text-gray-600 group-hover/heart:text-red-500"
            }`}
          />
        </button>

        {/* Property Image */}
        <Link href={`/properties/${property.id}`}>
          <div className="relative w-full h-full bg-gray-200">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoadingComplete={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <Link href={`/properties/${property.id}`} className="block">
          {/* Price */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-gray-900">{property.price}</p>
          </div>

          {/* Title and Location */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
              {property.title}
            </h3>
            <p className="text-gray-600 text-sm">{property.location}</p>
          </div>

          {/* Property Features */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Square className="w-4 h-4" />
              <span>{property.area}m²</span>
            </div>
          </div>
        </Link>

        {/* Contact Buttons */}
        <div className="flex space-x-2 mt-6">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
            View Details
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}
