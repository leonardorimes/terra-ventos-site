"use client";

import { Property } from "@/types/property";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties") // nome da sua tabela no Supabase
        .select("*");

      if (error) {
        console.error("Erro ao buscar propriedades:", error.message);
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terra Ventos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exclusive collection of luxury villas in the most
            prestigious locations around the world.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500">
            Carregando propriedades...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Load More Properties
          </button>
        </div>
      </main>
    </div>
  );
}
