import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppStore, faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Form alanları
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  // Sabit endpoint URL'leri
  const ADMIN_USERS_URL = "http://localhost:8080/api/admin/users";  // Kullanıcı listesi
  const VIDEOS_URL = "http://localhost:8080/videos";               // Video listeleme, ekleme, silme

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

  // Oturum kontrolü (token var mı?)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Token yoksa giriş sayfasına yönlendir
    }
  }, [navigate]);

  // Tüm kullanıcıları çek
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(ADMIN_USERS_URL, {
        headers: { Authorization: `Bearer ${token}` }, // Admin rolü gerektiriyorsa ekle
      });
      setUsers(response.data);
    } catch (error) {
      setErrorMessage("Kullanıcılar alınırken bir hata oluştu.");
      console.error("Kullanıcılar hata:", error);
    }
  };

  // Tüm videoları çek
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // (Eğer GET /videos herkese açıksa token olmadan da atılabilir, ama admin isek yine eklemen sorun olmaz.)
      const response = await axios.get(VIDEOS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(response.data);
    } catch (error) {
      setErrorMessage("Videolar alınırken bir hata oluştu.");
      console.error("Videolar hata:", error);
    }
  };

  // Video silme
  const deleteVideo = async (videoId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${VIDEOS_URL}/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((video) => video.videoId !== videoId));
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

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        VIDEOS_URL,
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
            Authorization: `Bearer ${token}`, // Sadece admin rolü POST atabilir
          },
        }
      );
      // API'den dönen yanıt bir mesaj olabilir, ya da yeni obje döndürebilirsin.  
      // Firestore "Video" entity'sinde "videoId" alanını da set etmiştik, 
      // ama API genelde "Video created with ID: ..." gibi string döner. 
      // "response.data" da "Video created with ID: abc123" gibi bir mesaj gelebilir.

      // Tekrar videoları çekerek listeyi güncelliyoruz (veya manual ekleyebilirsin)
      fetchVideos();

      // Formu sıfırla
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

  // Çıkış
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Tarih formatlayan örnek fonksiyon (Firestore tarih vs. varsa)
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
                    <tr key={user.userId || index} className="border-t">
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
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, index) => (
                    <tr key={video.videoId || index} className="border-t">
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
                        <a
                          href="https://testflight.apple.com/join/XXXXXX"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faApple} size="2x" />
                        </a>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteVideo(video.videoId)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {videos.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">
                        Video bulunamadı
                      </td>
                    </tr>
                  )}
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
