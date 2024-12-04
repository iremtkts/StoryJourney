import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Token, 3: Reset Password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    alert("E-postanıza bir doğrulama kodu gönderildi!");
    setStep(2);
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    console.log("Token submitted:", token);
    alert("Token doğrulandı! Şifre sıfırlama ekranına yönlendiriliyorsunuz.");
    setStep(3);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    console.log("Password reset successfully:", newPassword);
    alert("Şifreniz başarıyla değiştirildi! Giriş ekranına yönlendiriliyorsunuz.");
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/background.webp')`,
      }}
    >
      <div className="bg-white/80 rounded-lg shadow-lg p-8 max-w-md w-full">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-center text-purple-500 mb-6">
              Şifremi Unuttum
            </h1>
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
                Reset Password
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-center text-purple-500 mb-6">
              Doğrulama Kodunu Girin
            </h1>
            <form onSubmit={handleTokenSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700"
                >
                  Token
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  placeholder="E-postanıza gelen kodu girin"
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
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-center text-purple-500 mb-6">
              Yeni Şifre Belirleyin
            </h1>
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
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
