import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8080/api/admin"; // Backend URL'sini buraya yazın

 
  const formatDate = (createdAt) => {
    if (!createdAt) return "Tarih Yok";
    if (createdAt._seconds) {
      return new Date(createdAt._seconds * 1000).toLocaleDateString("tr-TR");
    }
    if (typeof createdAt === "string") {
      return new Date(createdAt).toLocaleDateString("tr-TR");
    }
    return "Tarih Yok";
  };

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setErrorMessage("Kullanıcılar alınırken bir hata oluştu.");
      console.error("Kullanıcılar hata:", error);
    }
  };

  // Videoları getir
  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`);
      setVideos(response.data);
    } catch (error) {
      setErrorMessage("Videolar alınırken bir hata oluştu.");
      console.error("Videolar hata:", error);
    }
  };

  // Video sil
  const deleteVideo = async (videoId) => {
    try {
      await axios.delete(`${BASE_URL}/videos/${videoId}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
      alert("Video başarıyla silindi!");
    } catch (error) {
      setErrorMessage("Video silinirken bir hata oluştu.");
      console.error("Video silme hata:", error);
    }
  };

  // Kullanıcı ve video verilerini yükle
  useEffect(() => {
    fetchUsers();
    fetchVideos();
  }, []);

  const handleLogout = () => {
    navigate("/"); // Login sayfasına yönlendirme
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9F9" }}>
      {/* Navigasyon */}
      <nav
        className="shadow p-4 flex justify-between items-center"
        style={{
          background: "linear-gradient(to right, #A9D4C0, #F3F6F4)",
        }}
      >
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <div>
          <span className="text-gray-700 font-medium mr-4">Merhaba, Admin</span>
          <button
            onClick={handleLogout}
            className="py-1 px-3 rounded hover:opacity-90"
            style={{
              backgroundColor: "#8FBFAD",
              color: "white",
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </nav>

      {/* İçerik */}
      <main className="p-6 space-y-6">
        {errorMessage && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg">{errorMessage}</div>
        )}

        {/* Kullanıcı Tablosu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tüm Kullanıcılar</h2>
          <div className="p-1 rounded-lg shadow-lg" style={{ backgroundColor: "#A9D4C0" }}>
            <div className="overflow-x-auto bg-white p-4 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Ad Soyad</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Doğrulama Durumu</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="p-4 text-sm text-gray-700">
                        {user.firstname} {user.lastname}
                      </td>
                      <td className="p-4 text-sm text-gray-700">{user.email}</td>
                      <td className="p-4 text-sm text-gray-700">
                        {user.isEmailVerified ? "Doğrulandı" : "Doğrulanmadı"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Video Tablosu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tüm Videolar</h2>
          <div className="p-1 rounded-lg shadow-lg" style={{ backgroundColor: "#A9D4C0" }}>
            <div className="overflow-x-auto bg-white p-4 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Başlık</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Açıklama</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Yaş Grubu</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Oluşturulma Tarihi</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, index) => (
                    <tr key={video.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="p-4 text-sm text-gray-700">{video.title}</td>
                      <td className="p-4 text-sm text-gray-700">{video.description}</td>
                      <td className="p-4 text-sm text-gray-700">{video.ageGroup || "Bilinmiyor"}</td>
                      <td className="p-4 text-sm text-gray-700">{formatDate(video.createdAt)}</td>
                      <td className="p-4 text-sm">
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="py-1 px-3 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Views Card */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">İzlenme Sayısı</h2>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className="text-gray-700">Bu alan izlenme bilgileri geldiğinde güncellenecektir.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
