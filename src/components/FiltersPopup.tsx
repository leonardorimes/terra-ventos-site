"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, Home, DollarSign } from "lucide-react";
import { Filters } from "@/types/filters";

interface FiltersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
  initialFilters?: Filters;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<Filters>(
    initialFilters || {
      priceRange: { min: undefined, max: undefined },
      propertyType: undefined,
      location: "",
      bedrooms: undefined,
      bathrooms: undefined,
      area: { min: undefined, max: undefined },
      featured: undefined,
    }
  );

  useEffect(() => {
    if (initialFilters) setFilters(initialFilters);
  }, [initialFilters]);

  const tiposImovel = [
    "Casa",
    "Apartamento",
    "Terreno",
    "Comercial",
    "Rural",
    "Lote Urbano",
  ];

  const handlePriceChange = (type: "min" | "max", value: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value ? Number(value) : undefined,
      },
    }));
  };

  const handleAreaChange = (type: "min" | "max", value: string) => {
    setFilters((prev) => ({
      ...prev,
      area: {
        ...prev.area,
        [type]: value ? Number(value) : undefined,
      },
    }));
  };

  const handleStringChange = (
    key: keyof Omit<
      Filters,
      "priceRange" | "area" | "bedrooms" | "bathrooms" | "features"
    >,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: "bedrooms" | "bathrooms", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ? Number(value) : undefined,
    }));
  };

  const handleFeaturesChange = (value: string) => {
    const featuresArray = value
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "");
    setFilters((prev) => ({ ...prev, features: featuresArray }));
  };

  const handleApply = () => onApplyFilters(filters);

  const clearFilters = () => {
    setFilters({
      priceRange: { min: undefined, max: undefined },
      propertyType: undefined,
      location: "",
      bedrooms: undefined,
      bathrooms: undefined,
      area: { min: undefined, max: undefined },
      featured: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Filtrar Propriedades</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Faixa de Preço
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Preço mínimo"
                value={filters.priceRange?.min || ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Preço máximo"
                value={filters.priceRange?.max || ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Localização
            </label>
            <input
              type="text"
              placeholder="Digite o bairro ou cidade"
              value={filters.location || ""}
              onChange={(e) => handleStringChange("location", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Tipo do imóvel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="inline w-4 h-4 mr-1" />
              Tipo do Imóvel
            </label>
            <select
              value={filters.propertyType || ""}
              onChange={(e) =>
                handleStringChange("propertyType", e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Todos os tipos</option>
              {tiposImovel.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Quartos e Banheiros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quartos e Banheiros
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Nº de quartos"
                value={filters.bedrooms || ""}
                onChange={(e) => handleNumberChange("bedrooms", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="number"
                placeholder="Nº de banheiros"
                value={filters.bathrooms || ""}
                onChange={(e) =>
                  handleNumberChange("bathrooms", e.target.value)
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Tamanho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho (m²)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Área mínima"
                value={filters.area?.min || ""}
                onChange={(e) => handleAreaChange("min", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Área máxima"
                value={filters.area?.max || ""}
                onChange={(e) => handleAreaChange("max", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Recursos / Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recursos (separados por vírgula)
            </label>
            <input
              type="text"
              placeholder="Ex: Piscina, Churrasqueira, Academia"
              value={filters.featured?.join(", ") || ""}
              onChange={(e) => handleFeaturesChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Limpar filtros
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPopup;
