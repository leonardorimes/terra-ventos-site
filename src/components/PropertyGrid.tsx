"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Bed, Bath, Square, Camera } from "lucide-react";
import { Property } from "@/types/property";
import Link from "next/link";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar propriedades:", error.message);
      } else {
        const mapped: Property[] = (data || []).map((p: any) => ({
          id: p.id,
          title: p.title ?? "Título indisponível",
          location: p.location ?? "Local não informado",
          price: p.price ?? "Preço sob consulta",
          bedrooms: p.bedrooms ?? 0,
          bathrooms: p.bathrooms ?? 0,
          area: p.area ?? 0,
          images: Array.isArray(p.images) ? p.images : [],
          featured: p.featured ?? false,
        }));
        setProperties(mapped);
      }

      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Carregando propriedades...</p>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhuma propriedade encontrada.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {properties.map((property) => (
        <Link href={`/propriedade/${property.id}`}>
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition"
          >
            {/* Imagem */}
            <div className="relative w-full h-64">
              {property.images.length > 0 ? (
                <Image
                  src={property.images[0]} // usa a primeira por enquanto
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <Camera size={40} />
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{property.title}</h3>
              <p className="text-gray-500 mb-2">{property.location}</p>
              <p className="text-green-600 font-bold mb-4">{property.price}</p>

              {/* Detalhes */}
              <div className="flex justify-between text-gray-600 text-sm">
                <span className="flex items-center gap-1">
                  <Bed size={16} /> {property.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath size={16} /> {property.bathrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Square size={16} /> {property.area} m²
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
