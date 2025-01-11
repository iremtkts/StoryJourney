import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppStore, faGooglePlay } from "@fortawesome/free-brands-svg-icons";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  // admin GET istekleri bu URL'yi kullansın
  const ADMIN_URL = "http://localhost:8080/api/admin";
  // video POST isteği bu URL'yi kullansın
  const VIDEO_URL = "http://localhost:8080/videos";

  useEffect(() => {
    // Geri butonunu engelleme
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Oturum kontrolü
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Token yoksa giriş sayfasına yönlendir
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ADMIN_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setErrorMessage("Kullanıcılar alınırken bir hata oluştu.");
      console.error("Kullanıcılar hata:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${ADMIN_URL}/videos`);
      setVideos(response.data);
    } catch (error) {
      setErrorMessage("Videolar alınırken bir hata oluştu.");
      console.error("Videolar hata:", error);
    }
  };

  // Video silme
  const deleteVideo = async (videoId) => {
    try {
      await axios.delete(`${ADMIN_URL}/videos/${videoId}`);
      setVideos((prev) => prev.filter((video) => video.id !== videoId));
      alert("Video başarıyla silindi!");
    } catch (error) {
      setErrorMessage("Video silinirken bir hata oluştu.");
      console.error("Video silme hata:", error);
    }
  };

  // Video ekleme (POST)
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // (Eğer token gerekiyorsa ekle, aksi halde Authorization satırını çıkar.)
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        VIDEO_URL, // <-- POST isteğini bu URL'ye atıyoruz
        {
          title,
          description,
          url,
          ageGroup,
          isPremium: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // JWT vs. gerekiyorsa ekle
          },
        }
      );
      setVideos((prev) => [...prev, response.data]);
      setTitle("");
      setDescription("");
      setUrl("");
      setAgeGroup("");
      alert("Video başarıyla eklendi!");
    } catch (error) {
      console.error("Axios Hatası:", error.response || error);
      setErrorMessage(error.response?.data || "Bilinmeyen bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchVideos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Tarih formatlayan örnek fonksiyon
  const formatDate = (createdAt) => {
    if (!createdAt) return "Tarih Yok";
    try {
      return new Date(createdAt).toLocaleDateString("tr-TR");
    } catch (e) {
      return "Tarih Yok";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9F9" }}>
      {/* Navigasyon */}
      <nav
        className="shadow p-4 flex justify-between items-center"
        style={{ background: "linear-gradient(to right, #A9D4C0, #F3F6F4)" }}
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
          <div className="text-red-500 bg-red-100 p-4 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Yeni Video Ekleme Formu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Yeni Video Ekle
          </h2>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Video başlığını girin"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Video açıklamasını girin"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Yaş Grubu</label>
                <input
                  type="text"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Örn: 3-6 yaş"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Video URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Video URL'sini girin"
                />
              </div>

              <button
                type="submit"
                className="py-2 px-4 rounded text-white"
                style={{
                  backgroundColor: "#8FBFAD",
                }}
              >
                Video Ekle
              </button>
            </form>
          </div>
        </section>

        {/* Kullanıcı Tablosu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Tüm Kullanıcılar
          </h2>
          <div
            className="p-1 rounded-lg shadow-lg"
            style={{ backgroundColor: "#A9D4C0" }}
          >
            <div
              className="overflow-y-auto bg-white p-4 rounded-lg"
              style={{ maxHeight: "300px" }}
            >
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Ad Soyad
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Doğrulama Durumu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {user.firstname} {user.lastname}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {user.email}
                      </td>
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
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Tüm Videolar
          </h2>
          <div
            className="p-1 rounded-lg shadow-lg"
            style={{ backgroundColor: "#A9D4C0" }}
          >
            <div
              className="overflow-y-auto bg-white p-4 rounded-lg"
              style={{ maxHeight: "300px" }}
            >
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Başlık
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Açıklama
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Yaş Grubu
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Mağaza Linkleri
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, index) => (
                    <tr key={video.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {video.title}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {video.description}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
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
                      </td>
                      {/* Silme butonu (istersen) */}
                      <td>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
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
      </main>
    </div>
  );
}

export default AdminDashboard;
