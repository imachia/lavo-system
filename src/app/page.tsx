import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lavo System
          </h1>
          <p className="text-gray-600 mb-8">
            Sistema de gerenciamento para lavanderias
          </p>
          
          {/* Login Button */}
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar
            <ArrowRight size={20} className="ml-2" />
          </Link>
          
          {/* Additional Links */}
          <div className="mt-8 space-y-3">
            <Link
              href="/register"
              className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Cadastrar Lojista
            </Link>
            <Link
              href="/recover"
              className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
