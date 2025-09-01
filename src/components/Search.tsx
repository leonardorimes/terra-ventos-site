"use client";
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import FiltersPopup from "./FiltersPopup";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("propriedades");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    console.log("Filtros aplicados:", filters);
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BCB785] focus:border-transparent"
            />
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
            Filtros
            {Object.keys(activeFilters).some((key) => activeFilters[key]) && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <button className="px-8 py-3 bg-[#AC761B] text-white rounded-lg font-medium">
            Buscar
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
