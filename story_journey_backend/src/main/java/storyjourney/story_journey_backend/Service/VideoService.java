package storyjourney.story_journey_backend.Service;


import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

import storyjourney.story_journey_backend.Dto.VideoDto;
import storyjourney.story_journey_backend.Exception.ResourceNotFoundException;
import storyjourney.story_journey_backend.Model.Video;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

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
    
    public List<Video> getAllVideos() {
        try {
            return db.collection("videos").get().get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(Video.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch videos", e);
        }
    }

    public void deleteVideo(String videoId) {
        try {
            db.collection("videos").document(videoId).delete().get();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete video", e);
        }
    }
    
    public long getVideoViewCount(String videoId) {
        try {
            return db.collection("views")
                     .whereEqualTo("videoRef", db.collection("videos").document(videoId))
                     .get()
                     .get()
                     .getDocuments()
                     .size();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch view count for video", e);
        }
    }


}
