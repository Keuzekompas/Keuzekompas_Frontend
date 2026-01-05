"use client";
import { useState, useEffect } from "react";
import { loginAPI } from "../lib/login";
import { getProfile } from "../lib/profile";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Reset states
    setServerError(null);
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    // Check if field are empty
    if (!email) {
      setEmailError("Please enter your email address.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    }

    // Check if email is valid Avans email
    if (email && !email.endsWith("@student.avans.nl")) {
      setEmailError("Please use a valid Avans email address.");
      hasError = true;
    }

    if (hasError) return;

    // 3. API call
    try {
      await loginAPI(email, password);
      router.push("/modules");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        // Check for network errors
        if (error.message === "NETWORK_ERROR" || error.message.includes("fetch")) {
          setServerError("Something went wrong. Please try again later.");
          return;
        }

        const status = (error as {status?: number}).status;
        if (status === 500) {
          setServerError("The server is temporarily unavailable. Please try again later.");
        } else {
          setServerError(error.message || "An unknown error occurred. Please try again.");
        }
      }
    }
  };





  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {/* noValidate added: this stops the browser popup (like 'missing @') */}
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
        {/* Here we show the specific error text for email */}
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
        {/* Here we show the specific error text for password */}
        {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}

        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-2">
            Login
        </button>

        {/* General Server Error display */}
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
