package storyjourney.story_journey_backend.Configuration;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import storyjourney.story_journey_backend.Service.JwtService;
import storyjourney.story_journey_backend.Utils.SecretKeyLoader;


@Configuration
public class JwtConfig {

    private final SecretKeyLoader secretKeyLoader;

    public JwtConfig(SecretKeyLoader secretKeyLoader) {
        this.secretKeyLoader = secretKeyLoader;
    }

    @Bean
    public JwtService jwtService() {
        return new JwtService(secretKeyLoader.getSecretKey());
    }
}
