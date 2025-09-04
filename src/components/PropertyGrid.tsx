"use client";
import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .limit(6); // Limita a 6 propriedades para o grid inicial

      if (error) {
        console.error("Erro ao buscar propriedades:", error.message);
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16 bg-[var(--background)]">
        <div className="text-center">
          <div className="text-gray-500">Carregando propriedades...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-[var(--background)]">
      {/* Título da seção */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Propriedades em Destaque
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Confira nossa seleção especial de propriedades premium cuidadosamente
          escolhidas para você.
        </p>
      </div>

      {/* Grid de propriedades */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhuma propriedade encontrada
          </h3>
          <p className="text-gray-500">
            Não foi possível carregar as propriedades no momento.
          </p>
        </div>
      )}
    </section>
  );
}
