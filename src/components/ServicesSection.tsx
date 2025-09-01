import React from 'react';

const ServicesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">P</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Propriedades</h3>
            <p className="text-gray-600">
              Encontre casas, apartamentos e terrenos em toda a região
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">I</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Invista</h3>
            <p className="text-gray-600">
              Oportunidades de investimento imobiliário com alta rentabilidade
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">C</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Consultoria</h3>
            <p className="text-gray-600">
              Especialistas prontos para ajudar você em cada etapa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;