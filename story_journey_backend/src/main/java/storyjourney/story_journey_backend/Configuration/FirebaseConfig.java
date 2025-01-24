package storyjourney.story_journey_backend.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;

import java.io.IOException;
import java.util.Base64;



@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() {
        
        String firebaseCredsB64 = System.getenv("FIREBASE_CREDS_B64");
        if (firebaseCredsB64 == null || firebaseCredsB64.isEmpty()) {
            throw new IllegalStateException("FIREBASE_CREDS_B64 environment variable is not set!");
        }

        try {
            System.out.println("Reading FIREBASE_CREDS_B64...");

           
            byte[] decodedBytes = Base64.getDecoder().decode(firebaseCredsB64);

           
            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(decodedBytes);

            
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                System.out.println("Initializing FirebaseApp...");
                FirebaseApp.initializeApp(options);
            } else {
                System.out.println("FirebaseApp already initialized!");
            }

            System.out.println("Returning Firestore instance...");
            return FirestoreClient.getFirestore();
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Firebase Firestore", e);
        }
    }
}
