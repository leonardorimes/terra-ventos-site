"use client";

import { Property } from "@/types/property";
import { Filters } from "@/types/filters";
import { useState, useEffect, useMemo } from "react";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: undefined, max: undefined },
    propertyType: undefined,
    location: "",
    bedrooms: undefined,
    bathrooms: undefined,
    area: { min: undefined, max: undefined },
    featured: undefined,
  });

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

  const filteredProperties = useMemo(() => {
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

    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter((property) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return true;

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
            default:
              return true;
          }
        })
      );
    }

    return filtered;
  }, [properties, searchTerm, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
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
            {searchTerm || Object.keys(filters).length > 0
              ? `Encontramos ${filteredProperties.length} propriedade(s) para você`
              : "Discover our exclusive collection of luxury villas in the most prestigious locations around the world."}
          </p>
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
            {(searchTerm || Object.keys(filters).length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    priceRange: { min: undefined, max: undefined },
                    propertyType: undefined,
                    location: "",
                    bedrooms: undefined,
                    bathrooms: undefined,
                    area: { min: undefined, max: undefined },
                    featured: undefined,
                  });
                }}
                className="bg-[#BCB785] text-white px-6 py-2 rounded-lg hover:bg-[#AC761B] transition-colors"
              >
                Limpar busca e filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
