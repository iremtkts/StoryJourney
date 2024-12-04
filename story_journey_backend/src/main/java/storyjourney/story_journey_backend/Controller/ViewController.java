package storyjourney.story_journey_backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.firebase.cloud.FirestoreClient;

import storyjourney.story_journey_backend.Model.View;
import storyjourney.story_journey_backend.Service.ViewService;

import java.util.List;

@RestController
@RequestMapping("/views")
public class ViewController {

    private final ViewService viewService;

    public ViewController(ViewService viewService) {
        this.viewService = viewService;
    }

    @PostMapping
    public ResponseEntity<String> addView(@RequestBody View view) {
        String viewId = viewService.addView(view);
        return ResponseEntity.ok("View added with ID: " + viewId);
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<View>> getViewsByVideo(@PathVariable String videoId) {
        return ResponseEntity.ok(viewService.getViewsByVideo(videoId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<View>> getViewsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(viewService.getViewsByUser(userId));
    }
    
    @PostMapping("/{videoId}/watch/{userId}")
    public ResponseEntity<String> addViewRecord(@PathVariable String videoId, @PathVariable String userId) {
        try {
            // Gelen videoId ve userId'nin boş olup olmadığını kontrol et
            if (videoId == null || videoId.isEmpty() || userId == null || userId.isEmpty()) {
                return ResponseEntity.badRequest().body("Video ID or User ID is missing.");
            }

            // Yeni bir View nesnesi oluştur
            View view = new View();
            view.setVideoRef(FirestoreClient.getFirestore().collection("videos").document(videoId)); // Video referansı
            view.setUserRef(FirestoreClient.getFirestore().collection("users").document(userId));   // Kullanıcı referansı

            // View kaydı ekle
            String viewId = viewService.addView(view);
            return ResponseEntity.ok("View record added with ID: " + viewId);

        } catch (Exception e) {
            // Hata durumunda anlamlı bir mesaj döndür
            return ResponseEntity.status(500).body("Failed to add view record: " + e.getMessage());
        }
    }


}
