import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-red-500 text-white p-2 rounded-lg">
              <span className="font-bold text-xl">T</span>
            </div>
            <span className="ml-3 font-bold text-xl text-gray-900">terraventos.com.br</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#propriedades" className="text-gray-700 hover:text-red-500 font-medium">
              Propriedades
            </a>
            <a href="#invista" className="text-gray-700 hover:text-red-500 font-medium">
              Invista
            </a>
            <a href="#sobre" className="text-gray-700 hover:text-red-500 font-medium">
              Sobre Nós
            </a>
            <a href="#contato" className="text-gray-700 hover:text-red-500 font-medium">
              Contato
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-red-500 font-medium">
              Entrar
            </button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-medium">
              Cadastrar
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="#propriedades" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Propriedades
            </a>
            <a href="#invista" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Invista
            </a>
            <a href="#sobre" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Sobre Nós
            </a>
            <a href="#contato" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Contato
            </a>
            <div className="border-t pt-4">
              <button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50">
                Entrar
              </button>
              <button className="block w-full text-left px-3 py-2 bg-red-500 text-white rounded-lg mt-2">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;