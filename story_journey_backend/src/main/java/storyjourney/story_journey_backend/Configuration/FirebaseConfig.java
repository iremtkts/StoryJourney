package storyjourney.story_journey_backend.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;

import java.io.IOException;



@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() {
        String firebaseCreds = System.getenv("FIREBASE_CREDS");
        if (firebaseCreds == null || firebaseCreds.isEmpty()) {
            throw new IllegalStateException("FIREBASE_CREDS environment variable is not set!");
        }

        try {
            // JSON içeriğini bir InputStream'e dönüştür
            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(firebaseCreds.getBytes());

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            return com.google.firebase.cloud.FirestoreClient.getFirestore();
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Firebase Firestore", e);
        }
    }
}
