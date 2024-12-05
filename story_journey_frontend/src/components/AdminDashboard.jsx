import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const navigate = useNavigate();

  // Dummy Veriler
  const dummyVideos = [
    { id: 1, title: "Eğitim Videosu 1", date: "2024-12-01", downloads: 5 },
    { id: 2, title: "Eğitim Videosu 2", date: "2024-12-02", downloads: 3 },
  ];

  const dummyUsers = [
    { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com" },
    { id: 2, name: "Ayşe Kaya", email: "ayse@example.com" },
  ];

  const dummyDownloads = [
    { id: 1, videoTitle: "Eğitim Videosu 1", user: "Ahmet Yılmaz", date: "2024-12-01" },
    { id: 2, videoTitle: "Eğitim Videosu 1", user: "Ayşe Kaya", date: "2024-12-01" },
    { id: 3, videoTitle: "Eğitim Videosu 2", user: "Ahmet Yılmaz", date: "2024-12-02" },
  ];

  useEffect(() => {
    // Dummy verileri yükle
    setVideos(dummyVideos);
    setUsers(dummyUsers);
    setDownloads(dummyDownloads);
  }, []);

  const handleLogout = () => {
    navigate("/"); // Login sayfasına yönlendirme
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9F9" }}>
      {/* Üst Navigasyon */}
      <nav
        className="shadow p-4 flex justify-between items-center"
        style={{
          background: "linear-gradient(to right, #A9D4C0, #F3F6F4)", 
        }}
      >
        <h1 className="text-xl font-bold text-green">Admin Dashboard</h1>
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

      {/* Dashboard İçerik */}
      <main className="p-6 space-y-6">
        {/* Videolar Tablosu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tüm Videolar</h2>
          <div
            className="p-1 rounded-lg shadow-lg"
            style={{ backgroundColor: "#A9D4C0" }}
          >
            <div className="overflow-x-auto bg-white p-4 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Başlık</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Yayın Tarihi</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">İndirme Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">{video.id}</td>
                      <td className="p-4 text-sm text-gray-700">{video.title}</td>
                      <td className="p-4 text-sm text-gray-700">{video.date}</td>
                      <td className="p-4 text-sm text-gray-700">{video.downloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Kullanıcılar Tablosu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tüm Kullanıcılar</h2>
          <div
            className="p-1 rounded-lg shadow-lg"
            style={{ backgroundColor: "#A9D4C0" }}
          >
            <div className="overflow-x-auto bg-white p-4 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">İsim</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">{user.id}</td>
                      <td className="p-4 text-sm text-gray-700">{user.name}</td>
                      <td className="p-4 text-sm text-gray-700">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tüm İndirmeler Tablosu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tüm İndirmeler</h2>
          <div
            className="p-1 rounded-lg shadow-lg"
            style={{ backgroundColor: "#A9D4C0" }}
          >
            <div className="overflow-x-auto bg-white p-4 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Video Başlığı</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Kullanıcı</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((download) => (
                    <tr key={download.id} className="border-t">
                      <td className="p-4 text-sm text-gray-700">{download.id}</td>
                      <td className="p-4 text-sm text-gray-700">{download.videoTitle}</td>
                      <td className="p-4 text-sm text-gray-700">{download.user}</td>
                      <td className="p-4 text-sm text-gray-700">{download.date}</td>
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
