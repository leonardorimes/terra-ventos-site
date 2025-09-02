"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import FiltersPopup from "./FiltersPopup";
import { useRouter } from "next/navigation";
import { Filters } from "@/types/filters";

interface SearchComponentProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  // Alterado o tipo de onFiltersChange para Filters
  onFiltersChange?: (filters: Filters) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  searchTerm = "",
  onSearchChange,
  onFiltersChange,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    priceRange: { min: undefined, max: undefined },
    propertyType: undefined,
    location: "",
    bedrooms: undefined,
    bathrooms: undefined,
    area: { min: undefined, max: undefined },
    features: undefined,
  });

  const router = useRouter();

  // Debounce para search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onSearchChange) onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timeout);
  }, [localSearch, onSearchChange]);

  // Função para verificar se há algum filtro ativo
  const hasFilters = () => {
    const {
      priceRange,
      area,
      features,
      propertyType,
      bedrooms,
      bathrooms,
      location,
    } = activeFilters;
    return (
      (priceRange?.min !== undefined && priceRange?.min !== null) ||
      (priceRange?.max !== undefined && priceRange?.max !== null) ||
      (area?.min !== undefined && area?.min !== null) ||
      (area?.max !== undefined && area?.max !== null) ||
      (features?.length && features.length > 0) ||
      (propertyType !== undefined && propertyType !== "") ||
      (bedrooms !== undefined && bedrooms !== null) ||
      (bathrooms !== undefined && bathrooms !== null) ||
      (location !== "" && location !== undefined)
    );
  };

  const handleApplyFilters = (filters: Filters) => {
    setActiveFilters(filters);

    if (onFiltersChange) {
      onFiltersChange(filters);
    } else if (localSearch || hasFilters()) {
      const params = new URLSearchParams();
      if (localSearch) params.set("q", localSearch);

      // Itera sobre o objeto de filtros para adicionar à URLSearchParams
      Object.entries(filters).forEach(([key, value]) => {
        if (key === "priceRange" && value && (value.min || value.max)) {
          if (value.min) params.set("priceMin", value.min.toString());
          if (value.max) params.set("priceMax", value.max.toString());
        } else if (key === "area" && value && (value.min || value.max)) {
          if (value.min) params.set("areaMin", value.min.toString());
          if (value.max) params.set("areaMax", value.max.toString());
        } else if (
          key === "features" &&
          Array.isArray(value) &&
          value.length > 0
        ) {
          params.set("features", value.join(","));
        } else if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });
      router.push(`/propriedade?${params.toString()}`);
    }

    setFiltersOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);

    // Se não há uma função onSearchChange, atualiza a URL para refletir a busca instantânea
    if (!onSearchChange) {
      const params = new URLSearchParams();
      if (value.trim() !== "") {
        params.set("q", value);
      }

      // Mantém os filtros existentes na URL ao buscar
      Object.entries(activeFilters).forEach(([key, filterValue]) => {
        if (
          key === "priceRange" &&
          filterValue &&
          (filterValue.min || filterValue.max)
        ) {
          if (filterValue.min)
            params.set("priceMin", filterValue.min.toString());
          if (filterValue.max)
            params.set("priceMax", filterValue.max.toString());
        } else if (
          key === "area" &&
          filterValue &&
          (filterValue.min || filterValue.max)
        ) {
          if (filterValue.min)
            params.set("areaMin", filterValue.min.toString());
          if (filterValue.max)
            params.set("areaMax", filterValue.max.toString());
        } else if (
          key === "features" &&
          Array.isArray(filterValue) &&
          filterValue.length > 0
        ) {
          params.set("features", filterValue.join(","));
        } else if (
          filterValue !== undefined &&
          filterValue !== null &&
          filterValue !== ""
        ) {
          params.set(key, String(filterValue));
        }
      });
      router.push(`/propriedade?${params.toString()}`);
    }
  };

  return (
    <>
      <FiltersPopup
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Input de Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar bairro, CEP ou cidade"
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BCB785] focus:border-transparent"
            />
          </div>

          {/* Botão de Filtros */}
          <button
            onClick={() => setFiltersOpen(true)}
            className={`flex items-center gap-2 px-6 py-3 border rounded-lg transition-colors ${
              hasFilters()
                ? "border-[#BCB785] bg-[#BCB785]/10 text-[#BCB785]"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtros
            {hasFilters() && (
              <span className="bg-[#BCB785] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
