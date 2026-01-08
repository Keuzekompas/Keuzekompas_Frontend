"use client";
import { useState, useEffect } from "react";
import { loginAPI, verify2faAPI } from "../lib/login";
import { getProfile } from "../lib/profile";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 2FA State
  const [is2FA, setIs2FA] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getProfile();
        router.push("/modules");
      } catch {
        // Not logged in, stay on login page
      }
    };
    checkAuth();
  }, [router]);

  const handleLoginError = (error: unknown) => {
    console.error("Login error:", error);
    if (error instanceof Error) {
      // Check for network errors
      if (error.message === "NETWORK_ERROR" || error.message.includes("fetch")) {
        setServerError(t('login.errors.networkError'));
        return;
      }

      const status = (error as { status?: number })?.status;
      if (status === 500) {
        setServerError(t('login.errors.serverError'));
      } else {
        setServerError(error.message || t('login.errors.unknownError'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Reset states
    setServerError(null);
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    // Check if field are empty
    if (!email) {
      setEmailError(t('login.errors.emailRequired'));
      hasError = true;
    }
    if (!password) {
      setPasswordError(t('login.errors.passwordRequired'));
      hasError = true;
    }

    // Check if email is valid Avans email
    if (email && !email.endsWith("@student.avans.nl")) {
      setEmailError(t('login.errors.emailInvalid'));
      hasError = true;
    }

    if (hasError) return;

    // 3. API call
    try {
      const response = await loginAPI(email, password);

      if (response.requires2FA) {
        setIs2FA(true);
        // tempToken is now handled via HttpOnly cookie
      } else {
        router.push("/modules");
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setOtpError("");
      setServerError(null);

      if (!otpCode || otpCode.length !== 6) {
          setOtpError("Code must be 6 digits");
          return;
      }

      try {
          await verify2faAPI(otpCode);
          router.push("/modules");
      } catch (error) {
          console.error("2FA error:", error);
          if (error instanceof Error) {
             setServerError(t('twoFactor.error'));
          }
      }
  };

  return (
    <div className="flex flex-col items-center justify-center grow w-full px-4 sm:px-0">
      <Card className="w-full max-w-sm bg-(--bg-card) mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-(--text-primary)">
            {is2FA ? t('twoFactor.title') : t('login.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {is2FA ? (
             <form className="flex flex-col w-full" onSubmit={handleOtpSubmit} noValidate>
                <label htmlFor="otp" className="mb-2 text-(--text-primary)">{t('twoFactor.codeLabel')}</label>
                <input
                  type="text"
                  id="otp"
                  maxLength={6}
                  className={`p-2 border rounded-lg outline-none bg-(--bg-input) text-(--text-primary) tracking-widest text-center text-xl ${
                    otpError 
                      ? "border-(--color-error) focus:border-red-700 mb-1" 
                      : "border-(--border-input) focus:border-(--color-brand) mb-4"
                  }`}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replaceAll(/\D/g, ''));
                    if (otpError) setOtpError("");
                  }}
                />
                {otpError && <p className="text-(--color-error) text-sm mb-3">{otpError}</p>}

                <button type="submit" className="p-2 bg-(--color-brand) text-white rounded-lg hover:bg-(--color-brand-hover) transition-colors mt-2">
                    {t('twoFactor.submitButton')}
                </button>
             </form>
          ) : (
            <form className="flex flex-col w-full" onSubmit={handleSubmit} noValidate>
              
              {/* EMAIL INPUT */}
              <label htmlFor="email" className="mb-2 text-(--text-primary)">{t('login.emailLabel')}</label>
              <input
                type="email"
                id="email"
                className={`p-2 border rounded-lg outline-none bg-(--bg-input) text-(--text-primary) ${
                  emailError 
                    ? "border-(--color-error) focus:border-red-700 mb-1" 
                    : "border-(--border-input) focus:border-(--color-brand) mb-4"
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
              />
              {/* Here we show the specific error text for email */}
              {emailError && <p className="text-(--color-error) text-sm mb-3">{emailError}</p>}

              {/* PASSWORD INPUT */}
              <label htmlFor="password" className="text-(--text-primary)">{t('login.passwordLabel')}</label>
              <input
                type="password"
                id="password"
                className={`p-2 border rounded-lg outline-none bg-(--bg-input) text-(--text-primary) ${
                  passwordError 
                    ? "border-(--color-error) focus:border-red-700 mb-1" 
                    : "border-(--border-input) focus:border-(--color-brand) mb-4"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
              />
              {/* Here we show the specific error text for password */}
              {passwordError && <p className="text-(--color-error) text-sm mb-3">{passwordError}</p>}

              <button type="submit" className="p-2 bg-(--color-brand) text-white rounded-lg hover:bg-(--color-brand-hover) transition-colors mt-2">
                  {t('login.submitButton')}
              </button>
            </form>
          )}

            {/* General Server Error display */}
            {serverError && (
                <p className="text-(--color-error) mt-2 text-sm font-medium text-center">
                    {serverError}
                </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
