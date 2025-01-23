package storyjourney.story_journey_backend.Test;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/firebase-test")
public class FirebaseTestController {

    private final Firestore firestore;

    public FirebaseTestController(Firestore firestore) {
        this.firestore = firestore;
    }

    @GetMapping("/test-firebase")
    public ResponseEntity<String> testFirebase() {
        try {
            System.out.println("Starting Firebase test...");

            
            firestore.collection("test").document("testDoc").get().get();
            System.out.println("Firebase connection is successful!");

            return ResponseEntity.ok("Firebase connection is successful!");
        } catch (Exception e) {
            System.err.println("Firebase connection failed: " + e.getMessage());
            e.printStackTrace(); // Tam hata mesajını görmek için
            return ResponseEntity.status(500).body("Firebase connection failed: " + e.getMessage());
        }
    }
}
