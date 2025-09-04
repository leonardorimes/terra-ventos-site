import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#3D2401] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - CTA */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-8">
                Comece seu caminho para
                <br />
                <span className="font-normal">o sucesso—contate-nos hoje.</span>
              </h2>

              <Link
                href="https://wa.me/558585572807"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#AC761B] to-[#c6a46a] rounded-full transition-all duration-300 hover:from-[#946016] hover:to-[#b4945d] hover:scale-105 hover:shadow-2xl hover:shadow-[#AC761B]/25 focus:outline-none focus:ring-4 focus:ring-[#AC761B]/20"
              >
                <span className="relative z-10">Entre em contato</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#AC761B] to-[#c6a46a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </Link>
            </div>
          </div>

          {/* Right Column - Navigation Links */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="text-[#c6a46a] text-sm">©2025 terraventos</div>

            {/* Legal Links */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
