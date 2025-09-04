"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";

// 1. Dados dos depoimentos com aspas substituídas por entidades HTML
const testimonials = [
  {
    quote:
      "Procurar nosso primeiro lar parecia uma tarefa gigante. A equipe da Terra Ventos não nos vendeu um imóvel, eles nos ajudaram a encontrar nosso lar. A paciência e o cuidado em cada detalhe fizeram toda a diferença.",
    author: "Ana e Carlos",
    role: "Em busca do primeiro lar",
    imageSrc:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=870&auto=format&fit=crop",
  },
  {
    quote:
      "Nossa família estava crescendo e precisávamos de espaço. O processo foi tão transparente e ágil que, quando percebemos, já estávamos fazendo churrasco na nossa nova casa. Eles não mediram esforços para encontrar o lugar perfeito para nós.",
    author: "Família Oliveira",
    role: "Mais espaço para a família",
    imageSrc:
      "https://images.unsplash.com/photo-1576104852640-c534de6b4797?q=80&w=870&auto=format&fit=crop",
  },
  {
    quote:
      "Com a rotina corrida, tudo que eu queria era um refúgio para desconectar. A equipe da Terra Ventos teve uma sensibilidade incrível para captar isso. O profissionalismo e a atenção ao meu bem-estar foram admiráveis.",
    author: "Mariana F.",
    role: "Encontrou seu santuário",
    imageSrc:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=774&auto=format&fit=crop",
  },
];

export default function TestimonialCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 10000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative w-full bg-[#AC761B] text-white overflow-hidden py-12 md:py-16 lg:py-20">
      {/* Elementos de fundo decorativos */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 bg-[#dbb370] opacity-20"
        style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      />
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-96 h-96 border-4 border-white/5 rounded-full z-0" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-white/80 font-semibold text-sm mb-4">
          <Home size={20} className="mr-2" />
          <span>DEPOIMENTOS</span>
        </div>
        <h2 className="text-4xl font-bold leading-tight mb-10">
          O que nossos clientes dizem:
        </h2>

        {/* 
          MODIFICAÇÃO: A imagem agora está na mesma coluna do texto para funcionar em layouts menores.
          A grade principal agora é de 1 coluna para centralizar o conteúdo.
        */}
        <div className="grid grid-cols-1 lg:max-w-3xl mx-auto items-center">
          {/* Seção Única: Texto, Imagem (oculta) e Controles */}
          <div className="flex flex-col space-y-8">
            <div className="bg-black/20 rounded-xl p-6 relative min-h-[180px] flex items-center">
              {/* 
                MODIFICAÇÃO: Uso de dangerouslySetInnerHTML para renderizar as entidades HTML.
                Isso garante que &ldquo; e &rdquo; se tornem aspas curvas.
              */}
              <p
                className="text-lg leading-relaxed text-white/90"
                dangerouslySetInnerHTML={{
                  __html: `&ldquo;${currentTestimonial.quote}&rdquo;`,
                }}
              />
            </div>
            <div>
              <p className="font-bold text-xl">{currentTestimonial.author}</p>
              <p className="text-sm text-white/70">{currentTestimonial.role}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ArrowLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* 
            MODIFICAÇÃO: Seção da imagem comentada 
            Quando quiser reativar, basta descomentar este bloco.
           o layout acima foi ajustado para funcionar bem sem a imagem.
            Para usar a imagem novamente, você pode querer voltar para o grid de 2 colunas (lg:grid-cols-2).
          */}
          {/*
          <div className="relative hidden lg:block w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              key={currentTestimonial.imageSrc}
              src={currentTestimonial.imageSrc}
              alt={`Depoimento de ${currentTestimonial.author}`}
              fill
              className="object-cover animate-fade-in"
              sizes="(max-width: 1024px) 0, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
