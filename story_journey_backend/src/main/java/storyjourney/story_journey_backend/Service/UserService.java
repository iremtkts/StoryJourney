package storyjourney.story_journey_backend.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;

import storyjourney.story_journey_backend.Dto.UserDto;
import storyjourney.story_journey_backend.Model.Status;
import storyjourney.story_journey_backend.Model.User;
import storyjourney.story_journey_backend.Utils.TokenUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final Firestore db;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public UserService(Firestore firestore, EmailService emailService) {
        this.db = firestore;
        this.passwordEncoder = new BCryptPasswordEncoder();
		this.emailService = emailService;
    }


    // Kullanıcı giriş doğrulama metodu
    public User findByEmail(String email) {
        try {
            QuerySnapshot snapshot = db.collection("users")
                    .whereEqualTo("email", email)
                    .limit(1)
                    .get()
                    .get();

            if (!snapshot.isEmpty()) {
                return snapshot.getDocuments().get(0).toObject(User.class);
            } else {
                return null; // email'e sahip user bulunamadı
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public List<User> getAllUsers() {
        try {
            return db.collection("users").get().get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(User.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    public String createUser(UserDto userDto) {
        // E-posta kontrolü: Zaten kayıtlı mı?
        User existingUser = findByEmail(userDto.getEmail().toLowerCase());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already registered.");
        }

        User user = new User();
        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());
        user.setEmail(userDto.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setStatus(Status.PENDING); // Başlangıç durumu PENDING

        // Email doğrulama token'ı oluştur ve kaydet
        String token = TokenUtil.generateEmailVerificationToken();
        user.setEmailVerificationToken(token);

        try {
            String userId = db.collection("users").add(user).get().getId();

            // Token'ı e-posta ile gönder
            sendVerificationEmail(user.getEmail(), token);

            return userId;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to create user", e);
        }
    }


        private void sendVerificationEmail(String email, String token) {
            String subject = "Email Verification";
            String message = "Your verification token is: " + token;
            emailService.sendEmail(email, subject, message);
        }

        public boolean verifyEmailToken(String token) {
            try {
                // Firestore'da token'ı sorgula
                ApiFuture<QuerySnapshot> query = db.collection("users").whereEqualTo("emailVerificationToken", token).get();
                QuerySnapshot querySnapshot = query.get();

                if (!querySnapshot.isEmpty()) {
                    QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0);

                    // Kullanıcı durumunu güncelle
                    document.getReference().update("isEmailVerified", true);
                    document.getReference().update("status", Status.ACTIVE.toString());
                    document.getReference().update("emailVerificationToken", null); // Token'ı temizle
                    return true;
                } else {
                    return false;
                }
            } catch (InterruptedException | ExecutionException e) {
                throw new RuntimeException("Failed to verify email token", e);
            }
        }
        
        public void handleForgotPassword(String email) {
            try {
                // Kullanıcıyı e-posta ile bul
                User user = findByEmail(email.toLowerCase());

                if (user == null) {
                    throw new IllegalArgumentException("E-posta adresiniz kayıtlı değil.");
                }

                // Kullanıcının durumunu `PENDING` yap ve yeni token oluştur
                String token = TokenUtil.generateEmailVerificationToken();
                user.setEmailVerificationToken(token);
                user.setStatus(Status.PENDING);

                // Veritabanında güncelle
                db.collection("users").document(user.getUserId()).update(
                    "emailVerificationToken", token,
                    "status", Status.PENDING.toString()
                );

                // Token'ı e-posta ile gönder
                sendVerificationEmail(user.getEmail(), token);
            } catch (Exception e) {
                throw new RuntimeException("Şifre sıfırlama işlemi sırasında bir hata oluştu.", e);
            }
        }


}
