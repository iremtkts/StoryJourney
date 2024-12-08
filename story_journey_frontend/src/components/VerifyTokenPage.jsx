import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyTokenPage() {
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Kayıt sırasında gelen email

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/verify",
        null,
        {
          params: { token },
        }
      );
  
      if (response.status === 200) {
        setSuccessMessage("Doğrulama başarılı!");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Doğrulama sırasında hata oluştu:", error);
      setErrorMessage("Token doğrulama başarısız. Lütfen tekrar deneyin.");
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
        <h1 className="text-3xl font-bold text-center text-purple-500 mb-6">
          E-posta Doğrulama
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Lütfen e-postanıza gönderilen kodu aşağıya girin.
        </p>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleTokenSubmit}>
          <div className="mb-4">
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700"
            >
              Doğrulama Kodu
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Doğrulama kodunuzu girin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Doğrula
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyTokenPage;
