package storyjourney.story_journey_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import storyjourney.story_journey_backend.Dto.VideoDto;
import storyjourney.story_journey_backend.Model.Video;
import storyjourney.story_journey_backend.Service.VideoService;


import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/videos")
public class VideoController {

    private final VideoService videoService;

    @Autowired
    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    // -- 1. Tüm videoları listele (herkes erişebilir) --
    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        List<Video> videos = videoService.getAllVideos();
        return ResponseEntity.ok(videos);
    }

    // -- 2. Video oluştur (Sadece ADMIN) --
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createVideo(@RequestBody VideoDto videoDto) {
        if (videoDto.getTitle() == null || videoDto.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required.");
        }
        if (videoDto.getDescription() == null || videoDto.getDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Description is required.");
        }
        if (videoDto.getUrl() == null || videoDto.getUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("URL is required.");
        }

        String videoId = videoService.createVideo(videoDto);
        return ResponseEntity.ok("Video created with ID: " + videoId);
    }

    // -- 3. Video detayını getir (herkes erişebilir) --
    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable String id) {
        Video video = videoService.getVideoById(id);
        return ResponseEntity.ok(video);
    }

    // -- 4. Video silme (Sadece ADMIN) --
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteVideo(@PathVariable String id) {
        videoService.deleteVideo(id);
        return ResponseEntity.ok("Video deleted successfully.");
    }

    // -- Opsiyonel: Görüntülenme sayısı (herkes erişebilir) --
    @GetMapping("/{id}/views")
    public ResponseEntity<Long> getVideoViewCount(@PathVariable String id) {
        long count = videoService.getVideoViewCount(id);
        return ResponseEntity.ok(count);
    }
}