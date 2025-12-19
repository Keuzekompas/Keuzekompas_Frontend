"use client";
import { useState } from "react";
import { loginAPI } from "../lib/login";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Algemene error state (voor API berichten die niet veld-specifiek zijn)
  const [serverError, setServerError] = useState<string | null>(null);

  // Validatie states: nu strings in plaats van booleans voor specifieke berichten
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Reset states
    setServerError(null);
    setEmailError("");
    setPasswordError("");

    // 2. Client-side Validatie
    let hasError = false;

    // Check of velden leeg zijn
    if (!email) {
      setEmailError("Vul je e-mailadres in.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Vul je wachtwoord in.");
      hasError = true;
    }

    // Check specifiek Avans student email (alleen als er al iets is ingevuld)
    if (email && !email.endsWith("@student.avans.nl")) {
      setEmailError("Gebruik een geldig @student.avans.nl e-mailadres.");
      hasError = true;
    }

    if (hasError) return;

    // 3. API Aanroep
    try {
      await loginAPI(email, password);
      router.push("/modules");
    } catch (error: any) {
      console.error("Login error:", error);

      // Check voor specifieke Netwerk fout (als de API uit staat)
      if (error.message === "NETWORK_ERROR" || error.message.includes("fetch")) {
         setServerError("Kan geen verbinding maken met de server. Controleer of de API draait.");
         return;
      }

      if (error.status === 500) {
        setServerError("De server is tijdelijk niet bereikbaar (500). Probeer het later.");
      } else {
        setServerError(error.message || "Er is een onbekende fout opgetreden.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {/* noValidate toegevoegd: dit stopt de browser popup (zoals 'missing @') */}
      <form className="flex flex-col w-full max-w-sm" onSubmit={handleSubmit} noValidate>
        
        {/* EMAIL INPUT */}
        <label htmlFor="email" className="mb-2">Email</label>
        <input
          type="email"
          id="email"
          className={`p-2 border rounded-lg outline-none ${
            emailError 
              ? "border-red-500 bg-red-50 focus:border-red-700 mb-1" 
              : "border-gray-200 focus:border-blue-500 mb-4"
          }`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
        />
        {/* Hier tonen we de specifieke error tekst voor email */}
        {emailError && <p className="text-red-500 text-sm mb-3">{emailError}</p>}

        {/* PASSWORD INPUT */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className={`p-2 border rounded-lg outline-none ${
            passwordError 
              ? "border-red-500 bg-red-50 focus:border-red-700 mb-1" 
              : "border-gray-200 focus:border-blue-500 mb-4"
          }`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
        />
        {/* Hier tonen we de specifieke error tekst voor wachtwoord */}
        {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}

        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-2">
            Login
        </button>

        {/* Algemene Server Error weergave */}
        {serverError && (
            <p className="text-red-500 mt-2 text-sm font-medium text-center">
                {serverError}
            </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;