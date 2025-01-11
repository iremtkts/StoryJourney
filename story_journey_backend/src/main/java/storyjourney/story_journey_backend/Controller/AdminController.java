package storyjourney.story_journey_backend.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import storyjourney.story_journey_backend.Dto.AdminDto;
import storyjourney.story_journey_backend.Model.User;
import storyjourney.story_journey_backend.Service.AdminService;
import storyjourney.story_journey_backend.Service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    @Autowired
    public AdminController(AdminService adminService, UserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    // Admin oluşturmak (sadece admin rolü bir başka admin oluşturuyorsa, yine preauthorize ile koru)
    @PostMapping("/register")
    public ResponseEntity<String> createAdmin(@RequestBody AdminDto adminDto) {
        try {
            String adminId = adminService.createAdmin(adminDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body("Admin created with ID: " + adminId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(e.getMessage());
        }
    }

    // Tüm kullanıcıları listelemek (sadece admin)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
