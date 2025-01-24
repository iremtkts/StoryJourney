import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { email, token } = location.state || {}; // Email ve token bilgileri

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor!");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.post(
        "https://storyjourney-production.up.railway.app/api/auth/reset-password",
        null, // body yok
        {
          params: {
            // cURL’de olduğu gibi token ve newPassword query paramına eklenecek
            token,
            newPassword
          }
        }
      );
    
      if (response.status === 200) {
        setSuccessMessage("Şifre başarıyla yenilendi! Giriş sayfasına yönlendiriliyorsunuz.");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Şifre sıfırlama sırasında hata oluştu:", error);
      setErrorMessage("Şifre sıfırlama başarısız. Lütfen tekrar deneyin.");
      setSuccessMessage("");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/background.webp')`,
      }}
    >
      <div className="bg-white/80 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-purple-500 mb-6">
          Yeni Şifre Belirleyin
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Lütfen yeni şifrenizi aşağıya girin.
        </p>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Yeni Şifre
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Yeni şifrenizi girin"
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Şifreyi Değiştir
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage
