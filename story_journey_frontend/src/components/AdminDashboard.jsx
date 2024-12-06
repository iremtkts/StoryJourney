import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [url, setUrl] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/api/admin";

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setErrorMessage("Kullanıcılar alınırken bir hata oluştu.");
      console.error("Kullanıcılar hata:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`);
      setVideos(response.data);
    } catch (error) {
      setErrorMessage("Videolar alınırken bir hata oluştu.");
      console.error("Videolar hata:", error);
    }
  };

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

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/videos`, {
        title,
        description,
        ageGroup,
        url: url || ""
      });
      
      setVideos((prevVideos) => [...prevVideos, response.data]);
      setTitle("");
      setDescription("");
      setAgeGroup("");
      setUrl("");
      alert("Video başarıyla eklendi!");
    } catch (error) {
      setErrorMessage("Video eklenirken bir hata oluştu.");
      console.error("Video ekleme hata:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchVideos();
  }, []);

  const handleLogout = () => {
    navigate("/");
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

        {/* Yeni Video Ekleme Formu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Yeni Video Ekle</h2>
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
                  placeholder="Yaş grubu (örn: 3-6 yaş)"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Video URL veya OverlyApp Linki</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Video URL'si veya boş bırakın (OverlyApp linki atanır)"
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
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tüm Kullanıcılar</h2>
          <div className="p-1 rounded-lg shadow-lg" style={{ backgroundColor: "#A9D4C0" }}>
            {/* max-height ve overflow-y eklendi */}
            <div className="overflow-y-auto bg-white p-4 rounded-lg" style={{ maxHeight: "300px" }}>
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
            {/* max-height ve overflow-y eklendi */}
            <div className="overflow-y-auto bg-white p-4 rounded-lg" style={{ maxHeight: "300px" }}>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Başlık</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Açıklama</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Yaş Grubu</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Oluşturulma Tarihi</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">URL</th>
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
                      <td className="p-4 text-sm text-gray-700">
                        {video.url ? (
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            Linke Git
                          </a>
                        ) : (
                          "Yok"
                        )}
                      </td>
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

        {/* İzlenme Sayısı Kartı */}
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
