package storyjourney.story_journey_backend.Controller;

import java.util.Map;

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
        if (loginDto == null || loginDto.getEmail() == null || loginDto.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email veya şifre eksik.");
        }

        String email = loginDto.getEmail();
        String password = loginDto.getPassword();

        // Admin kontrolü
        Admin admin = adminService.findByEmail(email);
        if (admin != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                String token = jwtService.generateToken(email, "ADMIN");
                return ResponseEntity.ok(Map.of("role", "ADMIN", "token", token));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin şifresi hatalı.");
            }
        }

        // Kullanıcı kontrolü
        User user = userService.findByEmail(email);
        if (user != null) {
            if (user.getStatus() == Status.PENDING) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("E-posta doğrulanmamış.");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtService.generateToken(email, "USER");
                return ResponseEntity.ok(Map.of("role", "USER", "token", token));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı şifresi hatalı.");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı veya admin bulunamadı.");
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
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Yeni şifre boş olamaz.");
        }

        try {
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Şifre başarıyla güncellendi.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Şifre sıfırlama sırasında bir hata oluştu.");
        }
    }



}
