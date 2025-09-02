"use client";

import { Property } from "@/types/property";
import { useState, useEffect, useMemo } from "react";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";

interface PriceRangeFilter {
  min?: number;
  max?: number;
}
interface Filters {
  priceRange?: PriceRangeFilter;
  propertyType?: string | string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: { min?: number; max?: number };
  features?: string[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({});

  // Buscar todas as propriedades
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*");

      if (error) {
        console.error("Erro ao buscar propriedades:", error.message);
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  // Função para filtrar propriedades em tempo real
  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Filtrar por termo de busca
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

    // Aplicar filtros adicionais
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter((property) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return true;

          switch (key) {
            case "priceRange":
              const priceFilter = value as PriceRangeFilter;
              const propertyPrice = parseFloat(property.price || "0"); // converte string para número
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
              return property.bedrooms >= value;

            case "bathrooms":
              return property.bathrooms >= value;

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
        });
      });
    }

    return filtered;
  }, [properties, searchTerm, filters]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
        searchTerm={searchTerm}
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

        {/* Results Info */}
        {(searchTerm || Object.keys(filters).length > 0) && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              {searchTerm && (
                <span>
                  Buscando por: <strong>&quot;{searchTerm}&quot;</strong>
                </span>
              )}
              {searchTerm && Object.keys(filters).length > 0 && (
                <span> • </span>
              )}
              {Object.keys(filters).length > 0 && (
                <span>{Object.keys(filters).length} filtro(s) aplicado(s)</span>
              )}
            </p>
          </div>
        )}

        {/* Loading */}
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
                  setFilters({});
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

        {/* Load More Button - só mostra se não há filtros ativos */}
        {!loading &&
          filteredProperties.length > 0 &&
          !searchTerm &&
          Object.keys(filters).length === 0 && (
            <div className="text-center mt-12">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Load More Properties
              </button>
            </div>
          )}
      </main>
    </div>
  );
}
