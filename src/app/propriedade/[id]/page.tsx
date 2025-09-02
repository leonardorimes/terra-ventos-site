// app/property/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MapPin, Home, Calendar, Loader } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Property } from "@/types/property";

interface PropertyWithExtras extends Property {
  formattedArea: string;
  timeAgo: string;
}

// Funções utilitárias
const getTimeAgo = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "1 dia atrás";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
  return `${Math.ceil(diffDays / 30)} meses atrás`;
};

const formatPrice = (priceText: string | null) =>
  priceText || "Preço sob consulta";

const extractPriceValue = (priceText: string | null): number => {
  if (!priceText) return 0;
  const numericValue = priceText.replace(/[^\d.]/g, "");
  return parseFloat(numericValue) || 0;
};

const fetchSimilarProperties = async (
  currentPrice: string | null,
  currentId: string
): Promise<PropertyWithExtras[]> => {
  try {
    const currentPriceValue = extractPriceValue(currentPrice);
    if (currentPriceValue === 0) return [];

    const priceVariation = 0.15; // 15%
    const minPrice = currentPriceValue * (1 - priceVariation);
    const maxPrice = currentPriceValue * (1 + priceVariation);

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        title,
        location,
        price,
        bedrooms,
        bathrooms,
        area,
        created_at,
        updated_at,
        images,
        description,
        featured
      `
      )
      .neq("id", currentId)
      .gte("price_numeric", minPrice)
      .lte("price_numeric", maxPrice)
      .limit(2);

    if (error) throw error;

    return (data || []).map((prop) => ({
      ...prop,
      images: Array.isArray(prop.images) ? prop.images : [],
      formattedArea: `${prop.area}m²`,
      timeAgo: getTimeAgo(prop.created_at),
    }));
  } catch (error) {
    console.error("Erro ao buscar propriedades similares:", error);
    return [];
  }
};

// Componente para card de propriedade similar
const SimilarPropertyCard = ({
  property,
}: {
  property: PropertyWithExtras;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48">
        <Image
          src={
            property.images[0] ||
            "https://via.placeholder.com/300x200?text=Sem+Imagem"
          }
          alt={property.title}
          fill
          className="object-cover"
        />
        {property.featured && (
          <div className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} quartos</span>
          </div>
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} banheiros</span>
          </div>
          <div className="flex items-center">
            <span>{property.formattedArea}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">
            {formatPrice(property.price)}
          </p>
          <p className="text-xs text-gray-500">{property.timeAgo}</p>
        </div>

        <button className="w-full mt-3 bg-[#AC761B] text-white font-medium py-2 px-4 rounded-lg text-sm hover:bg-[#8B5E16] transition-colors">
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

// Componente principal
export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [property, setProperty] = useState<PropertyWithExtras | null>(null);
  const [similarProperties, setSimilarProperties] = useState<
    PropertyWithExtras[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select(
            `
          id,
          title,
          location,
          price,
          bedrooms,
          bathrooms,
          area,
          created_at,
          updated_at,
          images,
          description,
          featured
        `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) {
          setError("Propriedade não encontrada.");
          setLoading(false);
          return;
        }

        const imagesArray = Array.isArray(data.images) ? data.images : [];

        const processedProperty: PropertyWithExtras = {
          ...data,
          images: imagesArray,
          formattedArea: `${data.area}m²`,
          timeAgo: getTimeAgo(data.created_at),
        };

        setProperty(processedProperty);
        if (imagesArray.length > 0) setMainImage(imagesArray[0]);

        const similar = await fetchSimilarProperties(data.price, id);
        setSimilarProperties(similar);

        setError(null);
      } catch (err: unknown) {
        console.error("Erro ao buscar dados da propriedade:", err);
        if (err instanceof Error) {
          setError(`Erro: ${err.message}`);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-[#AC761B]" size={48} />
      </div>
    );
  if (error)
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl text-red-600 font-semibold">{error}</h2>
      </div>
    );
  if (!property)
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl text-gray-600 font-semibold">
          Propriedade não encontrada.
        </h2>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{property.timeAgo}</span>
          </div>
          {property.featured && (
            <div className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          )}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked
                ? "text-red-500 bg-red-50"
                : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden mb-4 group h-96">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105 cursor-pointer"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {property.images && property.images.length > 1
              ? property.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden cursor-pointer h-32"
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              : Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center h-32"
                  >
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
          </div>

          {/* Property Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Detalhes da Propriedade
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center">
                <Home className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {property.bedrooms} quartos
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Home className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {property.bathrooms} banheiros
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Home className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {property.formattedArea}
                  </p>
                  <p className="text-sm text-gray-500">Área</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
            <p className="mb-4">{property.description}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-4">
            <div className="text-center mb-6">
              <p className="text-3xl font-light text-gray-900 mb-1">
                {formatPrice(property.price)}
              </p>
              <p className="text-sm text-gray-500">Oferta</p>
            </div>
            <button className="w-full bg-[#AC761B] text-white font-medium py-3 px-6 rounded-xl transition-colors mb-4">
              Entre em contato
            </button>
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3 mb-3">
                <div>
                  <p className="font-medium text-gray-900">Terra Ventos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Talvez essa propriedade possa lhe interessar também
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {similarProperties.map((similarProperty) => (
              <SimilarPropertyCard
                key={similarProperty.id}
                property={similarProperty}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
