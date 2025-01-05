package storyjourney.story_journey_backend.Utils;


import org.springframework.stereotype.Component;



import org.springframework.beans.factory.annotation.Value;


@Component
public class SecretKeyLoader {

    private final String secretKey;

    public SecretKeyLoader(@Value("${jwt.secretKey}") String secretKey) {
        this.secretKey = secretKey;
    }

    public String getSecretKey() {
        return secretKey;
    }
}
