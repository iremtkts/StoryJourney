package storyjourney.story_journey_backend.Service;


import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

import storyjourney.story_journey_backend.Dto.VideoDto;
import storyjourney.story_journey_backend.Exception.ResourceNotFoundException;
import storyjourney.story_journey_backend.Model.Video;

import org.springframework.stereotype.Service;


import java.util.concurrent.ExecutionException;

@Service
public class VideoService {

    private final Firestore db = FirestoreClient.getFirestore();

    public String createVideo(VideoDto videoDto) {
        Video video = new Video();
        video.setTitle(videoDto.getTitle());
        video.setDescription(videoDto.getDescription());
        video.setUrl(videoDto.getUrl());

        try {
     
            return db.collection("videos").add(video).get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create video", e);
        }
    }

    public Video getVideoById(String videoId) {
        try {

            return db.collection("videos").document(videoId).get().get().toObject(Video.class);
        } catch (InterruptedException | ExecutionException e) {
            throw new ResourceNotFoundException("Video not found with ID: " + videoId, e);
        }
    }
}
