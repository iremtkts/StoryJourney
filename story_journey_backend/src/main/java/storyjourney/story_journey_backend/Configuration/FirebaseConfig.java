package storyjourney.story_journey_backend.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration

public class FirebaseConfig {

    @Bean
    public Firestore firestore() throws IOException {
        String base64Creds = System.getenv("FIREBASE_CREDS");
        if (base64Creds == null) {
            throw new IllegalStateException("FIREBASE_CREDS not set in Heroku!");
        }
        
        byte[] decoded = Base64.getDecoder().decode(base64Creds);
        GoogleCredentials credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(decoded));
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(credentials)
            .build();
        FirebaseApp.initializeApp(options);
        return FirestoreClient.getFirestore();
    }
}
