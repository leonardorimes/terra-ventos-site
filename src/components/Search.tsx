"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import FiltersPopup from "./FiltersPopup";
import { useRouter } from "next/navigation";

interface SearchComponentProps {
  onSearchChange?: (term: string) => void;
  onFiltersChange?: (filters: any) => void;
  searchTerm?: string;
}

const SearchComponent = ({
  onSearchChange,
  onFiltersChange,
  searchTerm = "",
}: SearchComponentProps) => {
  const [activeTab, setActiveTab] = useState("propriedades");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const router = useRouter();

  // Debounce quando existe onSearchChange (página de propriedades)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearch, onSearchChange]);

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);

    if (onFiltersChange) {
      onFiltersChange(filters);
    } else {
      // Home → só redireciona se houver filtros ou busca
      const hasFilters = Object.keys(filters).some(
        (key) =>
          filters[key] &&
          (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
      );

      if (localSearch.trim() !== "" || hasFilters) {
        const params = new URLSearchParams();
        if (localSearch) params.set("q", localSearch);
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, JSON.stringify(value));
        });
        router.push(`/propriedade?${params.toString()}`);
      }
    }

    setFiltersOpen(false);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (!onSearchChange) {
      // Home → só redireciona se houver texto
      if (value.trim() !== "") {
        const params = new URLSearchParams();
        params.set("q", value);
        router.push(`/propriedade?${params.toString()}`);
      }
    }
  };

  const hasActiveFilters = Object.keys(activeFilters).some(
    (key) =>
      activeFilters[key] &&
      activeFilters[key] !== "" &&
      (Array.isArray(activeFilters[key]) ? activeFilters[key].length > 0 : true)
  );

  return (
    <>
      <FiltersPopup
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("propriedades")}
            className={`px-6 py-3 font-medium border-b-2 ${
              activeTab === "propriedades"
                ? "border-[#BCB785] text-[#BCB785]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Comprar
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar bairro, CEP ou cidade"
              value={localSearch}
              onChange={handleSearchInput}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BCB785] focus:border-transparent"
            />
          </div>

          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-lg transition-colors ${
              hasActiveFilters
                ? "border-[#BCB785] bg-[#BCB785]/10 text-[#BCB785]"
                : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
            Filtros
            {hasActiveFilters && (
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
