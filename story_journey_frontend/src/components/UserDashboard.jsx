import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppStore, faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons";

function UserDashboard() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/videos";

  // Geri gitmeyi engelle
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Oturum kontrolü (isteğe bağlı, eğer user da token’la giriş yapıyorsa)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Token yoksa giriş sayfasına yönlendir
    }
  }, [navigate]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Eğer GET /videos herkese açık ise header gerekmeyebilir
        const token = localStorage.getItem("authToken");
        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`, // kullanıcı rolü de olabilir
          },
        });
        setVideos(response.data);
      } catch (error) {
        setError("Videolar alınırken hata oluştu.");
        console.error("Videolar hata:", error);
      }
    };
    fetchVideos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Üst Navigasyon */}
      <nav className="bg-gradient-to-r from-purple-300 to-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Uygulama İkonu */}
          <img
            src="/favicon.ico"
            alt="Uygulama Logosu"
            className="w-10 h-10 mr-3 rounded-full"
          />
          <h1 className="text-xl font-bold text-purple-700">
            Hikaye Yolculuğu
          </h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-purple-500 text-white py-1 px-3 rounded hover:bg-purple-600"
          >
            Çıkış Yap
          </button>
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">AR İçerikleri</h2>
        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="p-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg shadow-lg">
          <div className="overflow-x-auto bg-white rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Video Başlığı
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Açıklama
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Yaş Grubu
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Mağaza Bağlantıları
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <tr key={video.videoId} className="border-t">
                      <td className="p-4 text-sm text-gray-700">
                        {video.title}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {video.description}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {video.ageGroup || "Bilinmiyor"}
                      </td>
                      <td className="p-4 text-sm flex space-x-4">
                        <a
                          href="https://apps.apple.com/tr/app/overly/id917343353?l=tr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faAppStore} size="2x" />
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.Overly.Cloud&pcampaignid=web_share"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faGooglePlay} size="2x" />
                        </a>
                        <a
                          href="https://testflight.apple.com/join/XXXXXX"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faApple} size="2x" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-sm text-gray-500">
                      Video bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
