package storyjourney.story_journey_backend.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;

import storyjourney.story_journey_backend.Dto.UserDto;
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

    // Kullanıcı oluşturma metodu
    public String createUser(UserDto userDto) {
        User user = new User();
        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());

        // E-posta adresini küçük harfe çevirerek kaydet
        user.setEmail(userDto.getEmail().toLowerCase());

        // Şifreyi hashleyerek kaydet
        String hashedPassword = passwordEncoder.encode(userDto.getPassword());
        user.setPassword(hashedPassword);

     // Email doğrulama token'ı oluştur
        String token = TokenUtil.generateEmailVerificationToken();
        user.setEmailVerificationToken(token);
        user.setIsEmailVerified(false);

        try {
            return db.collection("users").add(user).get().getId();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to create user", e);
        }
    }
    
    private void sendVerificationEmail(String email, String token) {
        String subject = "Verify Your Email";
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String message = "Hello,\n\nPlease verify your email by clicking the link below:\n" + verificationUrl;
        emailService.sendEmail(email, subject, message);
    }

    // Kullanıcı giriş doğrulama metodu
    public boolean authenticateUser(String email, String rawPassword) {
        try {
        	if (email == null || email.isEmpty()) {
        	    throw new RuntimeException("Email is required.");
        	}
            // E-posta adresini küçük harfe çevir
            String normalizedEmail = email.toLowerCase();
            System.out.println("Sorgulanan e-posta: " + normalizedEmail);

            // Kullanıcıyı e-posta ile sorgula
            ApiFuture<QuerySnapshot> query = db.collection("users").whereEqualTo("email", normalizedEmail).get();
            QuerySnapshot querySnapshot = query.get();

            // Sorgu sonucunu kontrol et
            if (!querySnapshot.isEmpty()) {
                User user = querySnapshot.getDocuments().get(0).toObject(User.class);
                System.out.println("Bulunan kullanıcı: " + user);

                // E-posta doğrulama kontrolü
                if (!user.getIsEmailVerified()) {
                    throw new RuntimeException("Email is not verified. Please verify your email before logging in.");
                }

                // Şifre doğrulama
                String hashedPassword = user.getPassword();
                boolean isPasswordMatch = passwordEncoder.matches(rawPassword, hashedPassword);

                if (!isPasswordMatch) {
                    throw new RuntimeException("Invalid password.");
                }

                return true;
            } else {
                throw new RuntimeException("User not found.");
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to authenticate user", e);
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
    
    public boolean verifyEmailToken(String token) {
        try {
            // Firestore'da token'ı sorgula
            ApiFuture<QuerySnapshot> query = db.collection("users").whereEqualTo("emailVerificationToken", token).get();
            QuerySnapshot querySnapshot = query.get();

            if (!querySnapshot.isEmpty()) {
                // Kullanıcıyı güncelle
                QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0);
                document.getReference().update("isEmailVerified", true);
                document.getReference().update("emailVerificationToken", null); // Token'ı temizle
                return true;
            } else {
                return false;
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to verify email token", e);
        }
    }


}
