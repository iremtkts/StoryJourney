package storyjourney.story_journey_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import storyjourney.story_journey_backend.Dto.LoginDto;
import storyjourney.story_journey_backend.Model.Admin;
import storyjourney.story_journey_backend.Model.Status;
import storyjourney.story_journey_backend.Model.User;
import storyjourney.story_journey_backend.Service.AdminService;
import storyjourney.story_journey_backend.Service.JwtService;
import storyjourney.story_journey_backend.Service.UserService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AdminService adminService; 
    private final JwtService jwtService;

    @Autowired
    public AuthController(UserService userService, AdminService adminService, JwtService jwtService) {
        this.userService = userService;
        this.adminService = adminService;
        this.jwtService = jwtService;
    }
    
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        boolean isVerified = userService.verifyEmailToken(token);
        if (isVerified) {
            return ResponseEntity.ok("Email verified successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        if (loginDto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Request body is missing or invalid.");
        }

        String email = loginDto.getEmail();
        String password = loginDto.getPassword();
        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or password is missing.");
        }

        // Önce admin koleksiyonunda email var mı diye bak
        Admin admin = adminService.findByEmail(email);
        if (admin != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                String token = jwtService.generateToken(email, "ADMIN");
                return ResponseEntity.ok().body(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials for admin.");
            }
        }

        // Admin bulunamadı, user koleksiyonunu kontrol et
        User user = userService.findByEmail(email);
        if (user != null) {
            // Kullanıcının durumu kontrol ediliyor
            if (user.getStatus() == Status.PENDING) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email not verified. Please verify your email before logging in.");
            }

            // Şifre kontrolü
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtService.generateToken(email, "USER");
                return ResponseEntity.ok().body(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials for user.");
            }
        }

        // Hiçbiri bulunamadı
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User or admin not found with given email.");
    }

    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            userService.handleForgotPassword(email);
            return ResponseEntity.ok("Şifre sıfırlama için bir token e-posta adresinize gönderildi.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    }


}
