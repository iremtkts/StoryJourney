package storyjourney.story_journey_backend.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
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
import java.util.Map;
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
        // Şifre kontrolü
        if (!isPasswordStrong(userDto.getPassword())) {
            throw new IllegalArgumentException("Şifre yeterince güçlü değil. En az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.");
        }

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

    private boolean isPasswordStrong(String password) {
        if (password == null || password.isEmpty()) {
            return false; // Şifre boşsa
        }

        boolean hasUppercase = password.matches(".*[A-Z].*"); // En az bir büyük harf
        boolean hasLowercase = password.matches(".*[a-z].*"); // En az bir küçük harf
        boolean hasDigit = password.matches(".*\\d.*");       // En az bir rakam
        boolean hasSpecialChar = password.matches(".*[@#$%^&+=!,.?].*"); // Özel karakterler
        boolean hasMinLength = password.length() >= 8;        // Minimum uzunluk

        // Debug için log ekleyin
        System.out.println("Uppercase: " + hasUppercase);
        System.out.println("Lowercase: " + hasLowercase);
        System.out.println("Digit: " + hasDigit);
        System.out.println("Special Char: " + hasSpecialChar);
        System.out.println("Min Length: " + hasMinLength);

        return hasUppercase && hasLowercase && hasDigit && hasSpecialChar && hasMinLength;
    }




        private void sendVerificationEmail(String email, String token) {
            String subject = "Email Verification";
            String message = "Your verification token is: " + token;
            emailService.sendEmail(email, subject, message);
        }

        public boolean verifyEmailToken(String token) {
            // Token boş ya da null mı kontrolü
            if (token == null || token.trim().isEmpty()) {
                throw new IllegalArgumentException("Token cannot be null or empty");
            }

            try {
                // Firestore'da token ile sorgu
                ApiFuture<QuerySnapshot> query = db.collection("users")
                                                   .whereEqualTo("emailVerificationToken", token)
                                                   .get();

                QuerySnapshot querySnapshot = query.get();

                if (!querySnapshot.isEmpty()) {
                    // Token eşleşen kullanıcı bulundu
                    QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0);

                    // Log: Kullanıcı bilgisi
                    System.out.println("User found with token. Updating user: " + document.getId());

                    // Firestore Transaction ile güncelleme
                    db.runTransaction(transaction -> {
                        DocumentReference docRef = document.getReference();
                        transaction.update(docRef, "isEmailVerified", true);
                        transaction.update(docRef, "status", Status.ACTIVE.toString());
                        transaction.update(docRef, "emailVerificationToken", null); // Token'ı temizle
                        return null;
                    });

                    System.out.println("User email verification and status updated successfully.");
                    return true;
                } else {
                    // Token eşleşen kullanıcı bulunamadı
                    System.out.println("No user found with the provided token.");
                    return false;
                }
            } catch (InterruptedException | ExecutionException e) {
                // Hata durumunda log ve exception fırlatma
                System.err.println("Error verifying email token: " + e.getMessage());
                throw new RuntimeException("Failed to verify email token", e);
            }
        }

        
        public void handleForgotPassword(String email) {
            try {
                User user = findByEmail(email.toLowerCase());
                if (user == null) {
                    throw new IllegalArgumentException("E-posta adresiniz kayıtlı değil.");
                }

                String token = TokenUtil.generateEmailVerificationToken();
                db.collection("users").document(user.getUserId()).update(
                    Map.of(
                        "emailVerificationToken", token,
                        "status", Status.PENDING.toString()
                    )
                );

                sendVerificationEmail(user.getEmail(), token);
            } catch (Exception e) {
                throw new RuntimeException("Şifre sıfırlama işlemi sırasında bir hata oluştu.", e);
            }
        }

        public void resetPassword(String token, String newPassword) {
            if (token == null || token.trim().isEmpty()) {
                throw new IllegalArgumentException("Token cannot be null or empty");
            }

            // Şifre kontrolü
            if (!isPasswordStrong(newPassword)) {
                throw new IllegalArgumentException("Şifre yeterince güçlü değil. En az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.");
            }

            try {
                // Token ile kullanıcıyı bul
                ApiFuture<QuerySnapshot> query = db.collection("users")
                                                   .whereEqualTo("emailVerificationToken", token)
                                                   .get();

                QuerySnapshot querySnapshot = query.get();

                if (!querySnapshot.isEmpty()) {
                    QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0);

                    // Yeni şifreyi hash'le ve kullanıcı bilgilerini güncelle
                    String hashedPassword = passwordEncoder.encode(newPassword);
                    db.runTransaction(transaction -> {
                        DocumentReference docRef = document.getReference();
                        transaction.update(docRef, "password", hashedPassword);
                        transaction.update(docRef, "emailVerificationToken", null); // Token'ı temizle
                        transaction.update(docRef, "status", Status.ACTIVE.toString()); // Durumu ACTIVE yap
                        return null;
                    });

                    System.out.println("Password updated successfully.");
                } else {
                    throw new IllegalArgumentException("Invalid or expired token.");
                }
            } catch (InterruptedException | ExecutionException e) {
                throw new RuntimeException("Failed to reset password", e);
            }
        }


}
