package storyjourney.story_journey_backend.Service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import storyjourney.story_journey_backend.Model.View;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;


@Service
public class ViewService {

    private final Firestore db = FirestoreClient.getFirestore();

   
    public String addView(View view) {
        try {
            return db.collection("views").add(view).get().getId();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to add view record", e);
        }
    }

    
    public List<View> getViewsByVideo(String videoId) {
        try {
            return db.collection("views")
                     .whereEqualTo("videoRef", db.collection("videos").document(videoId))
                     .get()
                     .get()
                     .getDocuments()
                     .stream()
                     .map(doc -> doc.toObject(View.class))
                     .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch views for video", e);
        }
    }

    
    public List<View> getViewsByUser(String userId) {
        try {
            return db.collection("views")
                     .whereEqualTo("userRef", db.collection("users").document(userId))
                     .get()
                     .get()
                     .getDocuments()
                     .stream()
                     .map(doc -> doc.toObject(View.class))
                     .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch views for user", e);
        }
    }
}
