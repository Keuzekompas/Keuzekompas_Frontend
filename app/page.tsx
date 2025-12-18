"use client";
import { useState } from "react";
import { login } from "../lib/login";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log("Submitting login for", email, password);
      await login(email, password);
      // Redirect or show success message here
    } catch (err: any) {
      setError("Login mislukt. Controleer je gegevens.");
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