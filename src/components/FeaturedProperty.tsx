"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Loader,
  Star,
  Camera,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Property } from "@/types/property";

const FeaturedProperty = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normaliza imagens vindas do Supabase (array text[] ou string legada)
  const processImages = (imagesField: unknown): string[] => {
    if (Array.isArray(imagesField)) {
      return imagesField
        .map((img) => (typeof img === "string" ? img.trim() : ""))
        .filter((img) => img.length > 0);
    }
    if (typeof imagesField === "string") {
      return imagesField
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img.length > 0);
    }
    return [];
  };

  // Formatar preço
  const formatPrice = (price: string | null) => {
    if (!price) return "Consulte o preço";
    if (price.includes("R$")) return price;

    const numericPrice = parseFloat(
      price.replace(/[^\d,.-]/g, "").replace(",", ".")
    );
    if (!isNaN(numericPrice)) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericPrice);
    }
    return price;
  };

  // Buscar propriedades em destaque
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);

        // ❗️Selecione apenas colunas existentes no seu schema
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
            images,
            featured,
            created_at
          `
          )
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) throw error;

        const processedData =
          data?.map((property: Property) => ({
            ...property,
            processedImages: processImages(property.images),
            formattedPrice: formatPrice(property.price),
          })) || [];

        setFeaturedProperties(processedData);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar propriedades em destaque:", err);
        setError("Erro ao carregar propriedades em destaque");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Estado de carregamento
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader
              className="animate-spin mx-auto mb-4 text-[#AC761B]"
              size={48}
            />
            <p className="text-gray-600">
              Carregando propriedades em destaque...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Sem propriedades em destaque
  if (featuredProperties.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Oportunidades em Destaque
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nenhuma propriedade está em destaque no momento
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oportunidades em Destaque
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra propriedades exclusivas em localizações privilegiadas
          </p>
        </div>

        {/* Grid de Propriedades */}
        <div className="grid gap-8 max-w-6xl mx-auto">
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                {/* Imagem */}
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-full bg-gray-200">
                    {property.processedImages?.length > 0 ? (
                      <Image
                        src={property.processedImages[0]}
                        alt={property.title || "Propriedade em destaque"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#AC761B] to-[#c6a46a] flex items-center justify-center">
                        <div className="text-white text-center">
                          <Camera className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-lg font-semibold">
                            {property.title || "Propriedade"}
                          </p>
                          <p className="text-sm opacity-90">
                            {property.location || "Localização não informada"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Badge destaque */}
                    <div className="absolute top-4 left-4 bg-[#AC761B] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star size={16} fill="currentColor" />
                      Destaque
                    </div>

                    {/* Contador de fotos */}
                    {property.processedImages?.length > 0 && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {property.processedImages.length} foto
                        {property.processedImages.length !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações */}
                <div className="md:w-1/2 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {property.title || "Título não informado"}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1 text-[#AC761B]" />
                        <span className="text-sm">
                          {property.location || "Localização não informada"}
                        </span>
                      </div>
                    </div>
                    <span className="bg-[#f3e7d1] text-[#AC761B] text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      Disponível
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {property.area && (
                      <div className="flex items-center text-gray-700">
                        <Square className="w-4 h-4 mr-2 text-[#AC761B]" />
                        <span className="text-sm">
                          {property.area}m² de área
                        </span>
                      </div>
                    )}
                    {property.bedrooms && (
                      <div className="flex items-center text-gray-700">
                        <Bed className="w-4 h-4 mr-2 text-[#AC761B]" />
                        <span className="text-sm">
                          {property.bedrooms}{" "}
                          {property.bedrooms === 1 ? "quarto" : "quartos"}
                        </span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center text-gray-700">
                        <Bath className="w-4 h-4 mr-2 text-[#AC761B]" />
                        <span className="text-sm">
                          {property.bathrooms}{" "}
                          {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Descrição genérica (sem depender de coluna inexistente) */}
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      Propriedade exclusiva com localização privilegiada
                      {property.location ? ` em ${property.location}` : ""}.
                      {property.area
                        ? ` Com ${property.area}m² de área, oferece conforto e qualidade.`
                        : " Oferece conforto e qualidade."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#AC761B]">
                      {property.formattedPrice}
                    </span>
                    <Link
                      href={`/propriedade/${property.id}`}
                      className="bg-gradient-to-r from-[#AC761B] to-[#c6a46a] text-white px-6 py-2 rounded-lg hover:from-[#946016] hover:to-[#b4945d] font-medium transition-all duration-300 flex items-center gap-2 no-underline"
                    >
                      <Home size={16} />
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/propriedade?all=true"
            className="bg-white border-2 border-[#AC761B] text-[#AC761B] px-8 py-3 rounded-lg hover:bg-[#AC761B] hover:text-white font-medium transition-all duration-300 inline-block no-underline"
          >
            Ver Todas as Propriedades
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperty;
