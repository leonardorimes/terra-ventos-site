// pages/acesso.tsx ou app/acesso/page.tsx

"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader,
  Home,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Componente que usa useSearchParams
const AuthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const supabase = createClientComponentClient();

  // Estado para controlar o carregamento inicial da sessão
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Seus outros estados
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  // Listener de autenticação para redirecionamento
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace(redirectUrl);
      } else {
        setIsCheckingSession(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router, redirectUrl]);

  // Limpar formulário ao trocar de modo
  useEffect(() => {
    setMessage({ type: "", text: "" });
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
  }, [isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage({
        type: "error",
        text: "Preencha todos os campos obrigatórios.",
      });
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        setMessage({ type: "error", text: "Nome completo é obrigatório." });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: "error", text: "As senhas não coincidem." });
        return false;
      }
      if (formData.password.length < 6) {
        setMessage({
          type: "error",
          text: "A senha deve ter pelo menos 6 caracteres.",
        });
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage({ type: "error", text: "Email ou senha incorretos." });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.fullName } },
    });

    if (error) {
      setMessage({ type: "error", text: "Este email já está cadastrado." });
    } else if (!data.session) {
      setMessage({
        type: "success",
        text: "Verifique seu email para confirmar a conta.",
      });
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: "Digite seu email primeiro." });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email);

    if (error) {
      setMessage({
        type: "error",
        text: "Erro ao enviar email de recuperação.",
      });
    } else {
      setMessage({
        type: "success",
        text: "Email de recuperação enviado. Verifique sua caixa de entrada.",
      });
    }
    setLoading(false);
  };

  // Renderiza um loader enquanto a sessão está sendo verificada.
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2ED]">
        <Loader className="animate-spin h-10 w-10 text-[#8B7355]" />
      </div>
    );
  }

  // Se a verificação terminou e não há sessão, renderiza a página de login completa.
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F2ED]">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-[#8B7355]">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Terraventos</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Faça login em sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-[#E0D9CF]">
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                message.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
          <form
            className="space-y-6"
            onSubmit={isLogin ? handleLogin : handleSignUp}
          >
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg border-[#D4CCC0] focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] disabled:bg-gray-100 disabled:opacity-50"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg border-[#D4CCC0] focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] disabled:bg-gray-100 disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-12 py-2 border rounded-lg border-[#D4CCC0] focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] disabled:bg-gray-100 disabled:opacity-50"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Confirme sua senha"
                    className="w-full pl-10 pr-12 py-2 border rounded-lg border-[#D4CCC0] focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] disabled:bg-gray-100 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            )}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg text-white font-medium bg-[#8B7355] hover:bg-[#7A6148] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B7355] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading && (
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                )}
                {loading
                  ? "Processando..."
                  : isLogin
                  ? "Entrar"
                  : "Criar Conta"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <div className="relative flex items-center justify-center">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              {isLogin ? (
                <>
                  Não tem uma conta?{" "}
                  <span className="font-medium text-[#8B7355]">
                    Cadastre-se
                  </span>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <span className="font-medium text-[#8B7355]">Faça login</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Terraventos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente principal com Suspense
const AuthPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F2ED]">
          <Loader className="animate-spin h-10 w-10 text-[#8B7355]" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
};

export default AuthPage;
