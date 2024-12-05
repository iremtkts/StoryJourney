import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", email, password);

    // Simüle edilen backend doğrulama
    // Burada backend'den dönen role bilgisi alınır
    const dummyRole = email === "admin@example.com" ? "admin" : "user";

    if (dummyRole === "admin") {
      navigate("/admin-dashboard"); // Admin Dashboard'a yönlendirme
    } else {
      navigate("/user-dashboard"); // Kullanıcı Dashboard'a yönlendirme
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/background.webp')`,
      }}
    >
      {/* Form Container */}
      <div className="bg-white/80 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-pink-500 mb-6">
          Hoş Geldiniz!
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Platformumuza giriş yapın ve eğlenceye katılın!
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              placeholder="E-postanızı girin"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              placeholder="Şifrenizi girin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Giriş Yap
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Şifremi Unuttum
          </a>
          <span className="mx-2 text-gray-400">|</span>
          <a href="/signup" className="text-sm text-blue-500 hover:underline">
            Kayıt Ol
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
