package storyjourney.story_journey_backend.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;

import storyjourney.story_journey_backend.Dto.AdminDto;
import storyjourney.story_journey_backend.Model.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new RuntimeException("Failed to create admin", e);
        }
    }

    public boolean authenticateAdmin(String email, String rawPassword) {
        try {
            ApiFuture<QuerySnapshot> query = db.collection("admins").whereEqualTo("email", email).get();
            QuerySnapshot querySnapshot = query.get();

            if (!querySnapshot.isEmpty()) {
                Admin admin = querySnapshot.getDocuments().get(0).toObject(Admin.class);
                String hashedPassword = admin.getPassword();

                if (admin.getIsActive() && passwordEncoder.matches(rawPassword, hashedPassword)) {
                    return true;
                } else {
                    throw new RuntimeException("Admin is inactive or credentials are incorrect.");
                }
            } else {
                throw new RuntimeException("Admin not found.");
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to authenticate admin", e);
        }
    }
}
