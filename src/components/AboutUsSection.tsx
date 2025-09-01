import React from "react";

const AboutUsSection = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            About us
          </h2>
          <h3 className="text-2xl sm:text-3xl text-gray-700 font-light">
            (Sobre nós)
          </h3>
          <div className="w-24 h-1 bg-gray-400 mx-auto mt-6"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Image and Company Info */}
          <div className="space-y-6">
            {/* Company Logo/Name */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-3xl font-light text-red-500 mb-4">exame.</h3>

              {/* Professional Photo */}
              <div className="relative">
                <img
                  src="./images/bernardo.png"
                  alt="Bernardo Carvalho Wertheim"
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* Our Founder Section */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Nosso Fundador
              </h3>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Bernardo Carvalho Wertheim é um empreendedor premiado, nascido
                  no Reino Unido, criado no Rio de Janeiro.
                </p>

                <p className="text-base">
                  Tendo construído negócios multinacionais, trabalhado em
                  empresas globais como Bloomberg e Accenture, lançado agências
                  de marketing e, finalmente, vendido uma potência global de
                  talentos para um grupo italiano, Bernardo é um especialista em
                  negócios, finanças e relacionamentos com reputação de
                  desenvolver empreendimentos internacionais.
                </p>

                <p className="text-base">
                  Bernardo agora se uniu a especialistas locais com décadas de
                  experiência em empreendimentos imobiliários e de terras à
                  beira-mar no Brasil para lançar a Terra Ventos e remodelar o
                  mercado imobiliário, com uma missão de impacto social.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex justify-center">
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
