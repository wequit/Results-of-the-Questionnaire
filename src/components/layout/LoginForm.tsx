"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { loginApi } from "@/lib/api/login";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import logo from "../../../public/logo.webp";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import dynamic from "next/dynamic";

const User = dynamic(() => import("lucide-react").then(mod => mod.User), { ssr: false });
const KeyRound = dynamic(() => import("lucide-react").then(mod => mod.KeyRound), { ssr: false });
const TriangleAlert = dynamic(() => import("lucide-react").then(mod => mod.TriangleAlert), { ssr: false });
const Eye = dynamic(() => import("lucide-react").then(mod => mod.Eye), { ssr: false });
const EyeOff = dynamic(() => import("lucide-react").then(mod => mod.EyeOff), { ssr: false });

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const { language, toggleLanguage, getTranslation } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIsPageLoaded(true);
    const timer = setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError(null);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError(getTranslation("LoginForm_EmptyFields"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginApi.login({
        username: credentials.username,
        password: credentials.password,
      });

      if (result && result.access) {
        await login(result.access);
        router.push("/Home/summary/ratings");
      } else {
        setError(getTranslation("LoginForm_NoToken") || "Access токен отсутствует в ответе");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err instanceof Error ? err.message : getTranslation("LoginForm_Error") || "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    },
    [isLoading]
  );

  const scrollStyle: React.CSSProperties = {
    overflowY: "auto",
    height: "100vh",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div
      style={scrollStyle}
      className={`bg-gradient-to-br from-slate-100 to-slate-200 transition-opacity duration-1000 ease-in-out ${isPageLoaded ? "opacity-100" : "opacity-0"
        }`}
      data-testid="login-form-container"
    >
      {/* Фоновые элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none ">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.svg')] opacity-[0.03]"></div>
        <div className="absolute -top-64 -right-64 w-[40rem] h-[40rem] bg-blue-800 opacity-[0.03] rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-indigo-700 opacity-[0.05] rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      {/* Переключатель языка */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex  animate-fadeIn">
        <div className="bg-blue-100/30 backdrop-blur-sm rounded-md overflow-hidden border border-blue-200/50 shadow-sm">
          <button
            onClick={toggleLanguage}
            aria-label={language === "ru" ? "Переключить на кыргызский" : "Переключить на русский"}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 text-sm font-semibold transition-all duration-300 ${language === "ru" ? "bg-blue-800 text-sky-50" : "text-sky-700 hover:bg-blue-400/50"
              }`}
          >
            RU
          </button>
          <button
            onClick={toggleLanguage}
            aria-label={language === "ky" ? "Переключить на русский" : "Переключить на кыргызский"}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 text-sm font-semibold transition-all duration-300 ${language === "ky" ? "bg-blue-800 text-sky-50" : "text-sky-700 hover:bg-blue-400/50"
              }`}
          >
            KY
          </button>
        </div>
      </div>

      {/* Основной контент - форма входа */}
      <div className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md transform transition-all duration-700 ease-out animate-float">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-7 sm:p-8 border border-gray-200/50 hover:shadow-blue-500/10 transition-all duration-500 ease-in-out group">
            {/* Эффект свечения */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-xl opacity-5 group-hover:opacity-15 transition duration-1000 animate-glow"></div>

            <div className="text-center mb-6 mt-2 animate-slideUp animation-delay-300">
              <div className="flex justify-center mb-4">
                <Image
                  src={logo}
                  alt="Логотип"
                  width={100}
                  height={100}
                  className=" rounded-lg "
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {getTranslation("LoginForm_LoginTitle")}
              </h2>
              <p className="text-gray-500 text-sm">
                {getTranslation("LoginForm_LoginSubtitle")}
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 animate-slideUp animation-delay-500" onKeyDown={handleKeyDown}>
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-1.5 transition-all duration-300 hover:text-blue-600">
                  {getTranslation("LoginForm_Username")}
                </label>
                <div className="relative transition-all duration-300 group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300 group-focus-within:text-blue-600">
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="username"
                    ref={usernameInputRef}
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                    onFocus={(e) => e.target.setAttribute("placeholder", "")}
                    onBlur={(e) => e.target.setAttribute("placeholder", getTranslation("LoginForm_Username"))}
                    placeholder={getTranslation("LoginForm_Username")}
                    className="text-base text-gray-900 placeholder:text-base placeholder:text-gray-900 bg-gray-50 border border-gray-300 rounded-lg block w-full pl-10 p-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 shadow-sm hover:shadow-md"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1.5 transition-all duration-300 hover:text-blue-600">
                  {getTranslation("LoginForm_Password")}
                </label>
                <div className="relative transition-all duration-300 group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300 group-focus-within:text-blue-600">
                    <KeyRound className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    onFocus={(e) => e.target.setAttribute("placeholder", "")}
                    onBlur={(e) => e.target.setAttribute("placeholder", getTranslation("LoginForm_Password"))}
                    placeholder={getTranslation("LoginForm_Password")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 pr-10 p-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 shadow-sm hover:shadow-md"
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-200"
                  >
                    {showPassword ? <Eye className="h-5 w-5" aria-hidden="true" /> : <EyeOff className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" aria-live="assertive" className="p-4 rounded-lg text-sm bg-red-50 border-l-4 border-red-500 text-red-600 animate-shake shadow-sm">
                  <div className="flex items-center">
                    <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                aria-label={isLoading ? getTranslation("LoginForm_Loading") : getTranslation("LoginForm_LoginButton")}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{getTranslation("LoginForm_Loading")}</span>
                  </div>
                ) : (
                  getTranslation("LoginForm_LoginButton")
                )}
              </button>

              <div className="text-center text-xs text-gray-500 mt-4 animate-fadeIn animation-delay-700">
                {getTranslation("LoginForm_HelpText")}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS для анимаций */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse-subtle {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes glow {
          0% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
          100% {
            opacity: 0.05;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite alternate;
        }

        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }

        .animate-glow {
          animation: glow 3s infinite;
        }

        .animate-shake {
          animation: shake 0.5s linear;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;