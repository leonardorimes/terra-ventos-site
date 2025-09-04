"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Square } from "lucide-react";
import { useState } from "react";

import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  console.log(property);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!property) return null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // Constrói a mensagem para o WhatsApp
  const whatsappMessage = `Olá, estou interessado na propriedade: ${property.title} (ID: ${property.id})`;
  // Codifica a mensagem para ser usada na URL
  const whatsappUrl = `https://wa.me/558585572807?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#AC761B] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
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
          <div className="relative w-full h-full bg-gray-200 cursor-pointer">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <Image
              src={property.images[0]}
              alt={property.title || "img"}
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
            <p className="text-2xl font-bold text-gray-900">
              {property.price || "Price not available"}
            </p>
          </div>

          {/* Title and Location */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#AC761B] transition-colors duration-200">
              {property.title || "Property title not available"}
            </h3>
            <p className="text-gray-600 text-sm">
              {property.location || "Location not available"}
            </p>
          </div>

          {/* Property Features */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms || 0}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms || 0}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Square className="w-4 h-4" />
              <span>{property.area || 0}m²</span>
            </div>
          </div>
        </Link>

        {/* Contact Buttons */}
        <div className="flex space-x-2 mt-6">
          <Link
            href={`/propriedade/${property.id}`}
            className="bg-gradient-to-r from-[#AC761B] to-[#c6a46a] text-white px-6 py-2 rounded-lg hover:from-[#946016] hover:to-[#b4945d] font-medium transition-all duration-300 flex items-center gap-2 no-underline"
          >
            Detalhes
          </Link>
          <Link
            href={whatsappUrl} // <-- AQUI ESTÁ A MUDANÇA
            target="_blank" // Abre o link em uma nova aba
            rel="noopener noreferrer" // Boas práticas de segurança para links externos
            className="flex-1 border border-[#AC761B] text-[#AC761B] py-2 px-4 rounded-full font-medium hover:bg-[#AC761B] hover:text-white transition-colors duration-300 flex items-center justify-center text-sm"
          >
            Contate
          </Link>
        </div>
      </div>
    </div>
  );
}
