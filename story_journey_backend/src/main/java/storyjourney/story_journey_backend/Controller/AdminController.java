package storyjourney.story_journey_backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import storyjourney.story_journey_backend.Dto.AdminDto;
import storyjourney.story_journey_backend.Model.User;
import storyjourney.story_journey_backend.Model.Video;
import storyjourney.story_journey_backend.Service.AdminService;
import storyjourney.story_journey_backend.Service.UserService;
import storyjourney.story_journey_backend.Service.VideoService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final VideoService videoService;

    @Autowired
    public AdminController(AdminService adminService, UserService userService, VideoService videoService) {
        this.adminService = adminService;
		this.userService = userService;
		this.videoService = videoService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> createAdmin(@RequestBody AdminDto adminDto) {
        try {
            String adminId = adminService.createAdmin(adminDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Admin created with ID: " + adminId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/videos")
    public ResponseEntity<List<Video>> getAllVideos() {
        List<Video> videos = videoService.getAllVideos();
        return ResponseEntity.ok(videos);
    }

    @DeleteMapping("/videos/{videoId}")
    public ResponseEntity<String> deleteVideo(@PathVariable String videoId) {
        try {
            videoService.deleteVideo(videoId);
            return ResponseEntity.ok("Video deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete video.");
        }
    }


}
