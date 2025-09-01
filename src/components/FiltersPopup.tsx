"use client";

import React, { useState } from "react";
import { X, MapPin, Home, DollarSign } from "lucide-react";

const FiltersPopup = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    bairro: "",
    tipoImovel: "",
    tamanhoMin: "",
    tamanhoMax: "",
  });

  const tiposImovel = [
    "Casa",
    "Apartamento",
    "Terreno",
    "Comercial",
    "Rural",
    "Lote Urbano",
  ];
  const bairros = [
    "Vila São Francisco",
    "Tatajuba",
    "Centro",
    "Praia da Velha",
    "Camocim",
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      bairro: "",
      tipoImovel: "",
      tamanhoMin: "",
      tamanhoMax: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Filtrar Propriedades</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Faixa de Preço
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Preço mínimo"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Preço máximo"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Bairro
            </label>
            <select
              value={filters.bairro}
              onChange={(e) => handleFilterChange("bairro", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Todos os bairros</option>
              {bairros.map((bairro) => (
                <option key={bairro} value={bairro}>
                  {bairro}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="inline w-4 h-4 mr-1" />
              Tipo do Imóvel
            </label>
            <select
              value={filters.tipoImovel}
              onChange={(e) => handleFilterChange("tipoImovel", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Todos os tipos</option>
              {tiposImovel.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho (m²)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Área mínima"
                value={filters.tamanhoMin}
                onChange={(e) =>
                  handleFilterChange("tamanhoMin", e.target.value)
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Área máxima"
                value={filters.tamanhoMax}
                onChange={(e) =>
                  handleFilterChange("tamanhoMax", e.target.value)
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

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
              onClick={handleApplyFilters}
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
