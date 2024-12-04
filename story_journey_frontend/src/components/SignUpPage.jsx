import React, { useState } from "react";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    console.log("User registered:", formData);
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
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Kayıt Ol
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Aramıza katıl ve eğlenceye başla!
        </p>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              İsim
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Adınızı girin"
              required
            />
          </div>
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="E-postanızı girin"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Şifrenizi girin"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Şifreyi Doğrula
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Kayıt Ol
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-blue-400 hover:underline">
            Zaten hesabın var mı? Giriş Yap
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
