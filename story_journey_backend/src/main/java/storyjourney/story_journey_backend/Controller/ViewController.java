package storyjourney.story_journey_backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.firebase.cloud.FirestoreClient;

import storyjourney.story_journey_backend.Dto.ViewDto;
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
    public ResponseEntity<String> addViewRecord(@RequestBody ViewDto viewDto) {
        try {
            // Gelen veriyi kontrol et
            if (viewDto.getUserRef() == null || viewDto.getVideoRef() == null) {
                return ResponseEntity.badRequest().body("User or video reference is missing.");
            }

            // View nesnesini oluştur
            View view = new View();
            view.setUserRef(FirestoreClient.getFirestore().document(viewDto.getUserRef()));
            view.setVideoRef(FirestoreClient.getFirestore().document(viewDto.getVideoRef()));
            view.setWatchedAt(viewDto.getWatchedAt());

            // Kaydet
            String viewId = viewService.addView(view);
            return ResponseEntity.ok("View record added with ID: " + viewId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add view record: " + e.getMessage());
        }
    }


}
