import React from "react";

const LuxuryDesignSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1575476777857-6281e369e0cb?q=80&w=419&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      />

      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-800/50 to-gray-900/60" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-emerald-400/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-400/10 rounded-full blur-md animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight mb-8 text-white">
          <span className="block">Onde terra,</span>
          <span className="block bg-gradient-to-r from-[#AC761B] to-[#c6a46a] bg-clip-text text-transparent">
            vento e sonhos
          </span>

          <span className="block bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent"></span>
          <span className="block">se encontram.</span>
        </h1>

        <div className="mt-12">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#AC761B] to-[#c6a46a] rounded-full transition-all duration-300 hover:from-[#946016] hover:to-[#b4945d] hover:scale-105 hover:shadow-2xl hover:shadow-[#AC761B]/30 focus:outline-none focus:ring-4 focus:ring-[#AC761B]/30">
            <span className="relative z-10">Vamos lá!</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#AC761B] to-[#c6a46a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </button>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#AC761B] via-[#c6a46a] to-[#e0c98d]" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/20 rounded-full animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default LuxuryDesignSection;
