package storyjourney.story_journey_backend.Service;



import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

import storyjourney.story_journey_backend.Dto.UserDto;
import storyjourney.story_journey_backend.Exception.ResourceNotFoundException;
import storyjourney.story_journey_backend.Model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private final Firestore db;

    @Autowired
    public UserService(Firestore firestore) {
        this.db = firestore;
    }

    public String createUser(UserDto userDto) {
        User user = new User();
        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());

        try {
            return db.collection("users").add(user).get().getId();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to create user", e);
        }
    }
}
