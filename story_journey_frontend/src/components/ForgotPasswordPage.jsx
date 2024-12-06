import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Burada navigate'i tanımlıyoruz

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        null,
        {
          params: { email },
        }
      );

      if (response.status === 200) {
        setSuccessMessage(response.data);
        setErrorMessage("");

        // Token doğrulama sayfasına yönlendir
        navigate("/verify-token", { state: { email } });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("E-posta adresiniz kayıtlı değil.");
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
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
      <div className="bg-white/80 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-purple-500 mb-6">
          Şifremi Unuttum
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Lütfen şifre sıfırlama işlemi için e-posta adresinizi girin.
        </p>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="E-postanızı girin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Şifre Sıfırla
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
