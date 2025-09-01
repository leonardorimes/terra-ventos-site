import React from 'react';
import { MapPin, Home, DollarSign, Search } from 'lucide-react';

const InvestmentHighlights = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que Investir Conosco</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Localização Privilegiada</h3>
            <p className="text-gray-600 text-sm">
              Áreas em crescimento com potencial turístico e valorização garantida
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Documentação Completa</h3>
            <p className="text-gray-600 text-sm">
              Todos os imóveis com documentação regularizada e pronta para transferência
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Excelente Custo-Benefício</h3>
            <p className="text-gray-600 text-sm">
              Valores competitivos comparado a áreas turísticas já estabelecidas
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Potencial Inexplorado</h3>
            <p className="text-gray-600 text-sm">
              Oportunidades únicas em destinos autênticos com grande potencial de crescimento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentHighlights;