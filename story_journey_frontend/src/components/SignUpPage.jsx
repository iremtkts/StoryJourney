import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Şifre kontrol fonksiyonu
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Şifre en az 8 karakter olmalıdır.");
    if (!/[A-Z]/.test(password)) errors.push("Şifre en az bir büyük harf içermelidir.");
    if (!/[a-z]/.test(password)) errors.push("Şifre en az bir küçük harf içermelidir.");
    if (!/\d/.test(password)) errors.push("Şifre en az bir rakam içermelidir.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Şifre en az bir özel karakter içermelidir.");
    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Şifre eşleşmesi kontrolü
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor!");
      setSuccessMessage("");
      return;
    }

    // Şifre kuralları kontrolü
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrorMessage(passwordErrors.join(" "));
      setSuccessMessage("");
      return;
    }

    try {
      // Backend'e kayıt isteği gönder
      const response = await axios.post("http://localhost:8080/api/users", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setSuccessMessage("Kayıt başarılı! Lütfen e-postanıza gelen kodu girin.");
        setErrorMessage("");
        setTimeout(() => {
          // Token doğrulama sayfasına yönlendirme
          navigate("/verify-token", { state: { email: formData.email } });
        }, 2000);
      }
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      setErrorMessage("Kayıt işlemi başarısız. Lütfen tekrar deneyin.");
      setSuccessMessage("");
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
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Kayıt Ol
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Aramıza katıl ve eğlenceye başla!
        </p>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
              Ad
            </label>
            <input
              id="firstname"
              type="text"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Adınızı girin"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Soyad
            </label>
            <input
              id="lastname"
              type="text"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Soyadınızı girin"
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
