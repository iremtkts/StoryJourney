package storyjourney.story_journey_backend.Utils;

import java.util.UUID;

public class TokenUtil {

    private TokenUtil() {
        // Private constructor to prevent instantiation
    }

    public static String generateEmailVerificationToken() {
        return UUID.randomUUID().toString();
    }
}
