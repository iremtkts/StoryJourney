package storyjourney.story_journey_backend.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import storyjourney.story_journey_backend.Dto.LoginDto;
import storyjourney.story_journey_backend.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto) {
        if (loginDto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Request body is missing or invalid.");
        }

        System.out.println("Email: " + loginDto.getEmail());
        System.out.println("Password: " + loginDto.getPassword());

        if (loginDto.getEmail() == null || loginDto.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or password is missing.");
        }
        return ResponseEntity.ok("Login successful!");
    }
}