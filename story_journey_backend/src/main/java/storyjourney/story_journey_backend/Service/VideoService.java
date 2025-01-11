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

    // Firestore örneğini alıyoruz
    private final Firestore db = FirestoreClient.getFirestore();

    
    public String createVideo(VideoDto videoDto) {
        Video video = new Video();
        video.setTitle(videoDto.getTitle());
        video.setDescription(videoDto.getDescription());
        video.setUrl(videoDto.getUrl());

        // Varsayılan veya gelen değerleri set et
        video.setAgeGroup(videoDto.getAgeGroup() != null ? videoDto.getAgeGroup() : "General");
        video.setIsPremium(videoDto.getIsPremium() != null ? videoDto.getIsPremium() : false);

        try {
            // Firestore "videos" koleksiyonuna ekliyoruz
            String videoId = db.collection("videos").add(video).get().getId();
           
            video.setVideoId(videoId);
            return videoId;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt(); 
            throw new RuntimeException("Failed to create video", e);
        }
    }

   
    public Video getVideoById(String videoId) {
        try {
            Video video = db.collection("videos")
                            .document(videoId)
                            .get()
                            .get()
                            .toObject(Video.class);
            if (video == null) {
                throw new ResourceNotFoundException("Video not found with ID: " + videoId);
            }
            
            return video;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Error retrieving video with ID: " + videoId, e);
        }
    }

   
    public List<Video> getAllVideos() {
        try {
            return db.collection("videos")
                     .get()
                     .get()
                     .getDocuments()
                     .stream()
                     .map(doc -> {
                         Video v = doc.toObject(Video.class);
                         if (v != null) {
                             v.setVideoId(doc.getId()); 
                         }
                         return v;
                     })
                     .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to fetch videos", e);
        }
    }

    
    public void deleteVideo(String videoId) {
        try {
            if (!db.collection("videos").document(videoId).get().get().exists()) {
                throw new ResourceNotFoundException("Video not found with ID: " + videoId);
            }
            db.collection("videos").document(videoId).delete().get();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
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
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to fetch view count for video", e);
        }
    }
}
