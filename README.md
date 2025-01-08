# **Story Journey - Proje README**

## **Giriş**
"Story Journey", geleneksel hikâye kitaplarındaki resimleri dijital olarak yeniden işleyip fresco tekniğiyle animasyona dönüştüren, ardından bu animasyonları Overly platformu aracılığıyla AR (Artırılmış Gerçeklik) videolarına çeviren bir projedir. Kullanıcı, özel bir uygulama (Overly) veya web arayüzü üzerinden kitabın sayfasını tarar; bu sayede statik resim yerine etkileşimli bir AR videosu deneyimler.

Bu uygulamada, bir yönetici (**Admin**) paneli aracılığıyla AR videolar yönetilir (ekleme, silme, güncelleme), kullanıcılar (**User**) ise kayıt olup e-posta doğrulamasını takiben bu içeriklere erişebilir. Veriler **Firestore NoSQL** veritabanında saklanır; kullanıcı kimlik doğrulaması **JWT** tabanlıdır. Proje, **SDLC**’nin 7 aşamasına göre planlanmış ve büyük ölçüde **Waterfall (Şelale) Modeli** esas alınarak hayata geçirilmiştir.

---

## **Planlama Aşaması**

### **Amaç ve Kapsam**
Planlama aşamasında, projenin amacı, hedef kitlesi, zaman çizelgesi ve genel kapsam belirlenmiştir. Kitaptaki görsellerin dijitalleştirilmesi, frescoda animasyon kurgusu, Overly aracılığıyla AR dönüşümü gibi yaratıcı süreçler planlama aşamasında vizyona konulmuştur. Ayrıca:
- **Veri depolama için:** Firestore
- **Back-end için:** Spring Boot
- **Kimlik doğrulama için:** JWT
- **AR deneyimi için:** Overly platformu seçilmiştir.

### **Ekip ve Teknolojiler**
#### **Ekip:**
- Proje Geliştiricisi (Backend- Frontend - Fresco tasarım)

#### **Teknolojiler:**
- **Back-end:** Spring Boot, Java
- **Veritabanı:** Firestore (NoSQL)
- **Ön yüz:** React + Tailwind CSS (Admin paneli ve kullanıcı arayüzü)
- **Güvenlik:** JWT tabanlı kimlik doğrulama
- **AR Platformu:** Overly (bulut tabanlı AR içerik sunucusu)
- **İletişim ve proje yönetimi araçları:** Trello, GitHub

### **Model Seçimi (Neden Waterfall?)**
- Gereksinimlerin baştan belirgin olması
- Eğitim ve yayıncılık sektöründe stabilize ihtiyaçlar
- Her aşamayı tamamlayarak bir sonrakine geçmeyi sağlayan yapının tercih edilmesi
- Güçlü dokümantasyon ve kontrol edilebilir zaman çizelgelerinin önemsenmesi

---

## **Analiz Aşaması**
Bu aşamada işlevsel ve işlevsel olmayan gereksinimler netleştirilmiş, veri modeline ilişkin beklentiler belirlenmiştir.

### **Gereksinimler**
- **Admin:** AR videoların eklenmesi, güncellenmesi, silinmesi; kullanıcı listelerinin incelenmesi.
- **User:** Kayıt olma, şifreli giriş, e-posta doğrulama, videoları listeleme ve Overly uygulamasıyla AR deneyimi.
- **Güvenlik:** Her istekte JWT kontrolü, rol bazlı erişim denetimleri.
- **Performans:** Hızlı yanıt süreleri, esnek sorgulamalar.

---

## **Tasarım Aşaması**

### **Veritabanı Tasarımı**
- **admins koleksiyonu:** Admin hesap bilgileri (email, şifre, zaman damgaları)
- **users koleksiyonu:** Kullanıcı hesap bilgileri, email doğrulama token’ı, durum bilgisi
- **videos koleksiyonu:** AR video başlıkları, açıklama, ageGroup, url (Overly linki), premium alanı

### **Mimari Kararlar**
- **Katmanlı mimari:** Controller (REST endpoint’leri), Service (iş mantığı), Repository (Firestore etkileşimi).
- **Güvenlik:** JWT üretimi ve doğrulaması için JwtService, rol bazlı erişim denetimi için SecurityConfig.

---

## **Geliştirme Aşaması**
- Spring Boot ile back-end, React ile admin paneli ve user arayüzleri geliştirilmiştir.
- **Firestore entegrasyonu:** UserService, AdminService, VideoService sınıfları ile sağlanmıştır.

### **AR İçerik Üretimi**
- Fresco animasyonları oluşturulup Overly platformuna yüklenmiş ve AR linkleri elde edilmiştir.

---

## **Test Aşaması**
- Entegrasyon testleri yapılmış, Overly ile AR çıktısı doğrulanmıştır.
- Güvenlik testlerinde JWT doğrulama ve rol bazlı erişim denetimi incelenmiştir.

---

## **Sonuç**
"Story Journey" projesi, AR videoları bir eğitim ve deneyim platformuna dönüştürerek kullanıcıların kitap deneyimini zenginleştirmiştir. Proje, profesyonel bir yazılım geliştirme örneği sunarak SDLC aşamalarını uygulamış, Waterfall modelini benimsemiştir.

---

**Trello Linki:** [Proje Yönetimi](https://trello.com/invite/b/6728a2fb7cb389f84bd13a42/ATTI196be6c21b6be9f78949532bb073f544D545D604/ymgk-proje)
