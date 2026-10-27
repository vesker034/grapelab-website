"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-10">
        <h1 className="text-2xl font-bold text-primary mb-6">GrapeLab Admin</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-textMuted font-medium">Email или логин</label>
            <input
              name="email"
              type="text"
              required
              autoComplete="username"
              className="w-full px-3 py-2 rounded-lg border border-borderLight text-base text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-textMuted font-medium">Пароль</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded-lg border border-borderLight text-base text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-base transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
