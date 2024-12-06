package storyjourney.story_journey_backend.Configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import storyjourney.story_journey_backend.Service.JwtService;

@Configuration
public class JwtConfig {
    
    @Value("${jwt.secretKey}")
    private String secretKey;
    
    @Bean
    public JwtService jwtService() {
        return new JwtService(secretKey);
    }
}
