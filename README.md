Giriş
"Story Journey", geleneksel hikâye kitaplarındaki resimleri dijital olarak yeniden işleyip fresco tekniğiyle animasyona dönüştüren, ardından bu animasyonları Overly platformu aracılığıyla AR (Artırılmış Gerçeklik) videolarına çeviren bir projedir. Kullanıcı, özel bir uygulama (Overly) veya web arayüzü üzerinden kitabın sayfasını tarar; bu sayede statik resim yerine etkileşimli bir AR videosu deneyimler.
Bu uygulamada, bir yönetici (Admin) paneli aracılığıyla AR videolar yönetilir (ekleme, silme, güncelleme), kullanıcılar (User) ise kayıt olup e-posta doğrulamasını takiben bu içeriklere erişebilir. Veriler Firestore NoSQL veritabanında saklanır; kullanıcı kimlik doğrulaması JWT tabanlıdır. Proje, SDLC’nin 7 aşamasına göre planlanmış ve büyük ölçüde Waterfall (Şelale) Modeli esas alınarak hayata geçirilmiştir.
Planlama Aşaması
Amaç ve Kapsam:
Planlama aşamasında, projenin amacı, hedef kitlesi, zaman çizelgesi ve genel kapsam belirlenmiştir. Kitaptaki görsellerin dijitalleştirilmesi, frescoda animasyon kurgusu, Overly aracılığıyla AR dönüşümü gibi yaratıcı süreçler planlama aşamasında vizyona konulmuştur. Ayrıca veri depolama için Firestore, back-end için Spring Boot, kimlik doğrulama için JWT ve AR deneyimi için Overly platformu seçilmiştir.
Ekip ve Teknolojiler:
Projenin ekip yapısı ve kullanılacak teknolojiler genellikle planlama aşamasında şekillenir. Bu aşamada:
Ekip: Yazılım geliştiriciler (Back-end, Front-end), tasarımcılar (fresco animasyon uzmanları), AR içerik sağlayıcılar, devops mühendisi, test mühendisi, ürün yöneticisi.
Teknolojiler:
Back-end: Spring Boot, Java
Veritabanı: Firestore (NoSQL)
Ön yüz: React + Tailwind CSS (Admin paneli ve kullanıcı arayüzü)
Güvenlik: JWT tabanlı kimlik doğrulama
AR Platformu: Overly (internet gerektiren, bulut tabanlı AR içerik sunucusu)
İletişim ve proje yönetimi araçları: Trello, GitHub
Model Seçimi (Neden Waterfall?):
Gereksinimlerin baştan belirgin olduğu, projenin eğitim ve yayıncılık sektöründe nispeten stabilize ihtiyaçlara sahip olduğu varsayılmıştır.
AR içerik, Overly platformu, veri yönetimi gibi kritik noktalar proje başında netleştirilmiştir.
Değişikliklerin minimum olması beklendiğinden, her aşamayı tamamlayarak bir sonrakine geçmeyi öngören Waterfall Modeli tercih edilmiştir.
Bu model, kontrol edilebilir zaman çizelgeleri ve dökümantasyonu güçlü bir şekilde teşvik etmesi nedeniyle proje paydaşları (yayıncı, içerik sağlayıcı) açısından anlaşılır bir yapıya sahiptir.

Analiz Aşaması
Bu aşamada işlevsel ve işlevsel olmayan gereksinimler netleştirilmiş, veri modeline ilişkin beklentiler belirlenmiştir. Kullanıcı senaryoları, aktörlerin (Admin, User) sistemi nasıl kullanacağı, e-posta doğrulama mekanizması, Overly entegrasyonu gibi konular detaylandırılmıştır.
Gereksinimler:
Admin: AR videoların eklenmesi, güncellenmesi, silinmesi; kullanıcı listelerinin incelenmesi.
User: Kayıt olma, şifreli giriş, e-posta doğrulama, videoları listeleme ve Overly uygulamasıyla AR deneyimi.
Güvenlik: Her istekte JWT kontrolü, rol bazlı erişim denetimleri.
Performans: Hızlı yanıt süreleri, esnek sorgulamalar.

Tasarım Aşaması
Tasarım aşamasında veritabanı modeli, mimari, güvenlik stratejileri ve kullanıcı arayüzü taslakları oluşturulur.
Veritabanı Tasarımı:
admins koleksiyonu: Admin hesap bilgileri (email, şifre, zaman damgaları)
users koleksiyonu: Kullanıcı hesap bilgileri, email doğrulama token’ı, durum bilgisi
videos koleksiyonu: AR video başlıkları, açıklama, ageGroup, url (Overly linki), premium alanı
(Opsiyonel) views koleksiyonu: İleride izleme istatistikleri için
Mimari Kararlar:
Katmanlı mimari: Controller (REST endpoint’leri), Service (iş mantığı), Repository (Firestore etkileşimi).
JWT üretimi, doğrulaması için ayrı bir servis (JwtService).
SecurityConfig ile rol bazlı erişim denetimi.

Trade-Off Kararlarının Tasarıma Etkisi:
Çevrimdışı özelliğinden vazgeçildiği için tasarımda lokal caching veya offline replikasyon yapısı kurgulanmadı. Bu basitlik sayesinde tasarım daha yalın ve hızlı geliştirilebilir hale geldi.

Geliştirme Aşaması
Kodlama, seçilen teknolojilere uygun olarak gerçekleştirilir. Spring Boot ile back-end, React ile admin paneli ve user arayüzleri geliştirilir. Firestore entegrasyonu UserService, AdminService, VideoService gibi sınıflarla sağlanır.
AR İçerik Üretimi:
Fresco animasyonları oluşturulur.
Bu animasyonlar Overly platformuna yüklenerek AR linkleri elde edilir. videos koleksiyonunda url alanına Overly linki kaydedilir.
Kullanıcı kitabı taradığında Overly, bu link üzerinden AR videosunu sunar.
Trade-Off Sonuçlarının Kodu Etkilemesi:
İzlenme istatistikleri (views) eklenmediği için kodda ilgili views servisine yer verilmedi. Bu da geliştirme süresini kısalttı.

Test Aşaması
Entegrasyon testleri  yapılır. Overly ile AR çıktısı doğrulanır. Güvenlik testleri JWT’nin doğru rol atadığını, admin uç noktalarına sadece admin rolüyle erişilebildiğini kanıtlar.
SWOT ve Trade-Off’ların Teste Yansıması:
Zayıf yanlar arasında belirtilen internet gereksinimi test aşamasında da ortaya çıkar: AR deneyimi test edilirken internet kesintisi simüle edildiğinde AR içeriğe ulaşılamadığı doğrulanır. 


Sonuç
"Story Journey" projesi, AR videoları bir eğitim ve deneyim platformuna dönüştürerek kullanıcıların kitap deneyimini zenginleştirmektedir. Proje SDLC’nin aşamalarını uygulamış, Waterfall modelini tercih etmiş, model seçim nedenlerini (stabil gereksinimler, dokümantasyon ve kontrol edilebilirlik) açıklamış, SWOT analiziyle güçlü/zayıf yönlerini ve fırsat/tehditlerini ortaya koymuş, trade-off kararlarını (internet gereksinimi, izlenme istatistiklerinin ertelenmesi) plana ve analize entegre etmiştir.
Ekip ve teknolojiler planlama aşamasında belirlenmiş, tasarım aşamasında mimari açıdan konumlandırılmış, geliştirme aşamasında uygulanmış, test aşamasında doğrulanmış, dağıtım aşamasında hayata geçirilmiş, bakım aşamasında sürekli iyileştirmeye açık bir yapı sunmuştur. Böylece "Story Journey" projesi, profesyonel bir yaklaşım ve dokümantasyonla uçtan uca yönetilmiş bir yazılım geliştirmenin örneği haline gelmiştir.


Trello linki : https://trello.com/invite/b/6728a2fb7cb389f84bd13a42/ATTI196be6c21b6be9f78949532bb073f544D545D604/ymgk-proje
