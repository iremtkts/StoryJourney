package storyjourney.story_journey_backend.Utils;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Component
public class SecretKeyLoader implements InitializingBean {

    private String secretKey;

    @Override
    public void afterPropertiesSet() throws Exception {
        this.secretKey = loadSecretKey();
    }

    private String loadSecretKey() {
        Properties props = new Properties();
        try (InputStream input = getClass().getResourceAsStream("/secret.properties")) {
            if (input == null) {
                throw new RuntimeException("secret.properties not found in classpath");
            }
            props.load(input);
            return props.getProperty("jwt.secretKey");
        } catch (IOException e) {
            throw new RuntimeException("Failed to load secret.properties", e);
        }
    }

    public String getSecretKey() {
        return secretKey;
    }
}
