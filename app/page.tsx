"use client";
import { useState } from "react";
import { loginAPI } from "../lib/login";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginAPI(email, password);
      router.push("/modules");
    } catch (err: any) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="flex flex-col w-full max-w-sm" onSubmit={handleSubmit}>
        <label htmlFor="email" className="mb-2">Email</label>
        <input
          type="email"
          id="email"
          className="p-2 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="p-2 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">Login</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;