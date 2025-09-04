"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Property } from "@/types/property";
import { Filters } from "@/types/filters";
import { supabase } from "@/lib/supabaseClient";

import AboutUsSection from "@/components/AboutUsSection";
import FeaturedProperty from "@/components/FeaturedProperty";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LuxuryDesignSection from "@/components/LuxuryDesignSection";
import PropertiesSection from "@/components/PropertiesSection";
import PropertyGrid from "@/components/PropertyGrid";
import TestimonialCard from "@/components/TestimonialCard";
import PropertyCard from "@/components/PropertyCard";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: undefined, max: undefined },
    location: "",
    bedrooms: undefined,
    bathrooms: undefined,
    area: { min: undefined, max: undefined },
    featured: undefined,
  });

  // Carrega propriedades do banco
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*");
      if (error) console.error("Erro ao buscar propriedades:", error.message);
      else setProperties(data as Property[]);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  // Verifica se há filtros ativos
  const hasActiveFilters = useCallback(() => {
    const { priceRange, area, featured, bedrooms, bathrooms, location } =
      filters;
    return (
      (priceRange?.min !== undefined && priceRange?.min !== null) ||
      (priceRange?.max !== undefined && priceRange?.max !== null) ||
      (area?.min !== undefined && area?.min !== null) ||
      (area?.max !== undefined && area?.max !== null) ||
      (featured !== undefined && featured !== null) ||
      (bedrooms !== undefined && bedrooms !== null) ||
      (bathrooms !== undefined && bathrooms !== null) ||
      (location !== "" && location !== undefined)
    );
  }, [filters]);

  // Determina se deve mostrar a página de resultados
  const showSearchResults = useMemo(
    () => searchTerm.trim() !== "" || hasActiveFilters(),
    [searchTerm, hasActiveFilters]
  );

  // Filtra propriedades baseado na busca e filtros
  const filteredProperties = useMemo(() => {
    if (!showSearchResults) return [];

    let filtered = properties;

    if (searchTerm.trim()) {
      filtered = filtered.filter((property) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          property.title?.toLowerCase().includes(searchLower) ||
          property.location?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (hasActiveFilters()) {
      filtered = filtered.filter((property) =>
        Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true;

          switch (key) {
            case "priceRange":
              const priceFilter = value as { min?: number; max?: number };
              const propertyPrice = parseFloat(property.price || "0");
              if (
                priceFilter.min !== undefined &&
                propertyPrice < priceFilter.min
              )
                return false;
              if (
                priceFilter.max !== undefined &&
                propertyPrice > priceFilter.max
              )
                return false;
              return true;
            case "bedrooms":
              return (property.bedrooms ?? 0) >= value;
            case "bathrooms":
              return (property.bathrooms ?? 0) >= value;
            case "area":
              const areaFilter = value as { min?: number; max?: number };
              const propertyArea = Number(property.area || 0);
              if (areaFilter.min !== undefined && propertyArea < areaFilter.min)
                return false;
              if (areaFilter.max !== undefined && propertyArea > areaFilter.max)
                return false;
              return true;
            case "location":
              return property.location
                ?.toLowerCase()
                .includes((value as string).toLowerCase());
            case "featured":
              return property.featured === Boolean(value);
            default:
              return true;
          }
        })
      );
    }

    return filtered;
  }, [properties, searchTerm, filters, showSearchResults, hasActiveFilters]);

  const handleClearSearchAndFilters = () => {
    setSearchTerm("");
    setFilters({
      priceRange: { min: undefined, max: undefined },
      location: "",
      bedrooms: undefined,
      bathrooms: undefined,
      area: { min: undefined, max: undefined },
      featured: undefined,
    });
  };

  if (showSearchResults) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Hero
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFiltersChange={setFilters}
        />

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terra Ventos
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {`Encontramos ${filteredProperties.length} propriedade(s) para você`}
            </p>
            {(searchTerm || hasActiveFilters()) && (
              <button
                onClick={handleClearSearchAndFilters}
                className="mt-4 text-[#BCB785] hover:text-[#AC761B] transition-colors underline"
              >
                ← Voltar para página inicial
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center text-gray-500">
              Carregando propriedades...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma propriedade encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar sua busca ou filtros para ver mais resultados.
              </p>
              <button
                onClick={handleClearSearchAndFilters}
                className="bg-[#BCB785] text-white px-6 py-2 rounded-lg hover:bg-[#AC761B] transition-colors"
              >
                Limpar busca e filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    );
  }

  // Página inicial completa
  return (
    <div className="bg-[var(--background)]">
      <Hero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFiltersChange={setFilters}
      />

      <PropertiesSection />
      <PropertyGrid />
      <TestimonialCard />
      <AboutUsSection />
      <LuxuryDesignSection />
      <FeaturedProperty />
      <Footer />
    </div>
  );
}
