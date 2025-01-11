package storyjourney.story_journey_backend.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import storyjourney.story_journey_backend.Dto.AdminDto;
import storyjourney.story_journey_backend.Model.Admin;

import java.util.concurrent.ExecutionException;


@Service
public class AdminService {

    private final Firestore db;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(Firestore firestore) {
        this.db = firestore;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

  
    public String createAdmin(AdminDto adminDto) {
        Admin admin = new Admin();
        admin.setFirstname(adminDto.getFirstname());
        admin.setLastname(adminDto.getLastname());
        admin.setEmail(adminDto.getEmail());

        String hashedPassword = passwordEncoder.encode(adminDto.getPassword());
        admin.setPassword(hashedPassword);

        try {
            return db.collection("admins").add(admin).get().getId();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to create admin", e);
        }
    }

 
    public Admin findByEmail(String email) {
        try {
            ApiFuture<QuerySnapshot> future = db.collection("admins")
                                                .whereEqualTo("email", email)
                                                .limit(1)
                                                .get();
            QuerySnapshot snapshot = future.get();
            if (!snapshot.isEmpty()) {
                return snapshot.getDocuments().get(0).toObject(Admin.class);
            } else {
                return null;
            }
        } catch (Exception e) {
           
            return null;
        }
    }
}
