"use client";

import React from "react";
import SearchComponent from "./Search";

interface HeroProps {
  onSearchChange?: (term: string) => void;
  onFiltersChange?: (filters: any) => void;
  searchTerm?: string;
}

const Hero: React.FC<HeroProps> = ({
  onSearchChange,
  onFiltersChange,
  searchTerm,
}) => {
  return (
    <section className="relative min-h-96 flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/terraventos.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Propriedades para chamar de lar
          </h1>
          <p className="text-xl text-white opacity-90">
            Encontre o imóvel dos seus sonhos
          </p>
        </div>

        <SearchComponent
          searchTerm={searchTerm || ""}
          onSearchChange={onSearchChange}
          onFiltersChange={onFiltersChange}
        />
      </div>
    </section>
  );
};

export default Hero;
