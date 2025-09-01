"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
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

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  // Verificar se já está logado
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/admin"); // ou página principal
      }
    };

    checkUser();
  }, [router]);

  // Limpar mensagens quando trocar de modo
  useEffect(() => {
    setMessage({ type: "", text: "" });
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
  }, [isLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar mensagem quando começar a digitar
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, fullName } = formData;

    if (!email || !password) {
      setMessage({
        type: "error",
        text: "Por favor, preencha todos os campos obrigatórios.",
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: "error", text: "Por favor, insira um email válido." });
      return false;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "A senha deve ter pelo menos 6 caracteres.",
      });
      return false;
    }

    if (!isLogin) {
      if (!fullName) {
        setMessage({
          type: "error",
          text: "Por favor, insira seu nome completo.",
        });
        return false;
      }

      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "As senhas não coincidem." });
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Login realizado com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (error) {
      console.error("Erro no login:", error);

      if (error.message.includes("Invalid login credentials")) {
        setMessage({ type: "error", text: "Email ou senha incorretos." });
      } else {
        setMessage({
          type: "error",
          text: error.message || "Erro ao fazer login.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Cadastro realizado! Verifique seu email para confirmar a conta.",
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);

      if (error.message.includes("User already registered")) {
        setMessage({ type: "error", text: "Este email já está cadastrado." });
      } else {
        setMessage({
          type: "error",
          text: error.message || "Erro ao criar conta.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setMessage({
        type: "error",
        text: "Por favor, insira seu email primeiro.",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Link de recuperação enviado para seu email!",
      });
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      setMessage({
        type: "error",
        text: "Erro ao enviar email de recuperação.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#F5F2ED" }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#8B7355" }}
            >
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Terraventos</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Faça login em sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* Form */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 border"
          style={{ borderColor: "#E0D9CF" }}
        >
          {/* Message Alert */}
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
            {/* Full Name - Only for Sign Up */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:opacity-50"
                    style={{
                      borderColor: "#D4CCC0",
                      focusRingColor: "#8B7355",
                    }}
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:opacity-50"
                  style={{
                    borderColor: "#D4CCC0",
                    focusRingColor: "#8B7355",
                  }}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:opacity-50"
                  style={{
                    borderColor: "#D4CCC0",
                    focusRingColor: "#8B7355",
                  }}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password - Only for Sign Up */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:opacity-50"
                    style={{
                      borderColor: "#D4CCC0",
                      focusRingColor: "#8B7355",
                    }}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Link - Only for Login */}
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundColor: "#8B7355",
                  focusRingColor: "#8B7355",
                }}
                onMouseOver={(e) =>
                  !loading && (e.target.style.backgroundColor = "#7A6148")
                }
                onMouseOut={(e) =>
                  !loading && (e.target.style.backgroundColor = "#8B7355")
                }
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

          {/* Toggle Login/SignUp */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "#E0D9CF" }}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                {isLogin ? (
                  <>
                    Não tem uma conta?{" "}
                    <span className="font-medium" style={{ color: "#8B7355" }}>
                      Cadastre-se
                    </span>
                  </>
                ) : (
                  <>
                    Já tem uma conta?{" "}
                    <span className="font-medium" style={{ color: "#8B7355" }}>
                      Faça login
                    </span>
                  </>
                )}
              </button>
            </div>
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

export default AuthPage;
