import Image from "next/image";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";

export default function TestimonialCard() {
  const testimonialData = {
    quote:
      "Encontrei a casa ideal rapidinho! Os anúncios eram detalhados, as fotos eram precisas e todo o processo foi tranquilo. O atendimento ao cliente foi de primeira, respondendo a todas as minhas perguntas. Com certeza usarei esta plataforma novamente no futuro!",
    role: "cliente",
    author: "Jack Bauer",
    imageSrc: "/images/depo.jpg",
  };

  return (
    <div className="relative w-full bg-[#AC761B] text-white overflow-hidden py-8 md:py-12 lg:py-16">
      {/* Background shape */}
      <div
        className="absolute top-0 right-0 h-full w-1/2"
        style={{
          clipPath: "polygon(50% 0, 100% 0, 100% 100%, 0% 100%)",
          backgroundColor: "#AC761B",
        }}
      ></div>
      <div
        className="absolute top-0 right-0 w-2/3 h-full"
        style={{
          clipPath: "polygon(50% 0, 100% 0, 100% 100%, 0% 100%)",
          backgroundColor: "#dbb370",
        }}
      ></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-96 h-96 border-4 border-white/5 rounded-full z-0"></div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Section - Text and Controls */}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center text-[#AC761B] font-semibold text-sm">
            <Home size={20} className="mr-2" />
            <span>Depoimentos</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            O que nossos clientes dizem:
          </h2>
          <div className="bg-gray-800 rounded-xl p-6 relative">
            <p className="text-lg leading-relaxed text-gray-300">
              {testimonialData.quote}
            </p>
          </div>
          <div>
            <p className="font-bold text-lg">{testimonialData.author}</p>
            <p className="text-sm text-gray-400">{testimonialData.role}</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <ArrowLeft size={24} className="text-white" />
            </button>
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="relative hidden lg:block w-full h-96">
          <Image
            src={testimonialData.imageSrc}
            alt={`${testimonialData.author} testimonial`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 0, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
