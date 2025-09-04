"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const properties = [
  {
    src: "/images/kitevillas.JPG",
    title: "Ilha do Farol - Kite Villas",
    desc: "O condomínio de casas à beira-mar foi projetado para oferecer requinte aos velejadores e suas famílias, com acesso exclusivo ao mar e serviços personalizados.",
  },
  {
    src: "/images/home4.webp",
    title: "casas à beira-mar",
    desc: "Acorde todos os dias com a brisa do oceano em nossas casas de praia premium.",
  },
];

export default function PropertiesSection() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % properties.length);
  };

  // Troca automática a cada 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % properties.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-[var(--background)]">
      {/* Texto principal */}
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore os melhores imóveis <br /> com serviços especializados.
        </h1>
        <p className="text-gray-600 mb-6">
          Descubra uma gama diversificada de imóveis premium, desde apartamentos
          luxuosos até vilas espaçosas, adaptados às suas necessidades.
        </p>
        <Link
          href="/propriedade"
          className="bg-[#AC761B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#BCB785] transition-colors duration-300"
        >
          Ver propriedades
        </Link>
      </div>

      {/* Grid de propriedades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card grande com overlay e carrossel */}
        <div className="relative group col-span-1 md:col-span-2 lg:col-span-2">
          <Image
            src={properties[index].src}
            alt={properties[index].title}
            width={900}
            height={600}
            className="rounded-xl object-cover w-full h-[400px] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-semibold">
              {properties[index].title}
            </h3>
            <p className="text-gray-200 mt-2 mb-4">{properties[index].desc}</p>
            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors"
            >
              <ArrowRight className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Outras imagens fixas */}
        <Image
          src="/images/home5.webp"
          alt="Kite Villas"
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-[190px]"
        />
        <Image
          src="/images/home6.webp"
          alt="Office"
          width={720}
          height={1080}
          className="rounded-xl object-cover w-full h-[190px]"
        />
        <Image
          src="/images/home4.webp"
          alt="Office"
          width={720}
          height={1080}
          className="rounded-xl object-cover w-full h-[190px]"
        />
      </div>
    </section>
  );
}
