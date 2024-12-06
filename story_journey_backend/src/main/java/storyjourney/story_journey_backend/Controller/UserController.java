package storyjourney.story_journey_backend.Controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import storyjourney.story_journey_backend.Dto.UserDto;
import storyjourney.story_journey_backend.Model.User;
import storyjourney.story_journey_backend.Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired 
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            String userId = userService.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully with ID: " + userId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }


    @PostMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        boolean isVerified = userService.verifyEmailToken(token);
        if (isVerified) {
            return ResponseEntity.ok("Email verified successfully! User is now ACTIVE.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }
}
