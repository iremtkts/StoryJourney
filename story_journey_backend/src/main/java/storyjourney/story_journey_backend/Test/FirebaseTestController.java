package storyjourney.story_journey_backend.Test;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/test")
public class FirebaseTestController {

    private final Firestore firestore;

    public FirebaseTestController(Firestore firestore) {
        this.firestore = firestore;
    }

    @GetMapping("/firebase")
    public ResponseEntity<String> testFirebase() {
        try {
            firestore.collection("test").document("testDoc").get().get();
            return ResponseEntity.ok("Firebase connection is successful!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Firebase connection failed: " + e.getMessage());
        }
    }
}
