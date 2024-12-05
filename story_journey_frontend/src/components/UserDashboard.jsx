import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8080/api/admin"; // Backend URL

  useEffect(() => {
 
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/videos`);
        setVideos(response.data);
      } catch (error) {
        console.error("Videolar alınırken hata oluştu:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleLogout = () => {
    navigate("/"); 
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Üst Navigasyon */}
      <nav className="bg-gradient-to-r from-purple-300 to-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="favicon.ico"
            alt="Hikaye Yolculuğu Logo"
            className="w-8 h-8 mr-2 rounded-full"
          />
          <h1 className="text-xl font-bold text-purple-700">Hikaye Yolculuğu</h1>
        </div>
        <div>
          <span className="text-gray-700 font-medium mr-4">
            Hoş Geldiniz, Kullanıcı!
          </span>
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

        {/* Gradient Borderlı Kart */}
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
                    Yayın Tarihi
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    İndir
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <tr key={video.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">{video.title}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {video.description}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {video.ageGroup || "Bilinmiyor"}
                      </td>
                      <td className="p-4 text-sm text-gray-500">{video.date}</td>
                      <td className="p-4 text-sm">
                        <a
                          href={video.downloadLink}
                          download
                          className="bg-purple-500 text-white py-1 px-3 rounded hover:bg-purple-600"
                        >
                          İndir
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-4 text-sm text-gray-500"
                    >
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

