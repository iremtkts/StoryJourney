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

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor!");
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
          {/* Inputlar */}
          {/* ... */}
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
