package storyjourney.story_journey_backend.Controller;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import storyjourney.story_journey_backend.Dto.VideoDto;
import storyjourney.story_journey_backend.Model.Video;
import storyjourney.story_journey_backend.Service.VideoService;

@RestController
@RequestMapping("/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping
    public ResponseEntity<String> createVideo(@RequestBody VideoDto videoDto) {
        // Zorunlu alanların kontrolü
        if (videoDto.getTitle() == null || videoDto.getDescription() == null || videoDto.getUrl() == null) {
            return ResponseEntity.badRequest().body("Title, description, and URL are required.");
        }

        // Video oluştur
        String videoId = videoService.createVideo(videoDto);
        return ResponseEntity.ok("Video created with ID: " + videoId);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable String id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }
    
    @GetMapping("/{id}/views")
    public ResponseEntity<Long> getVideoViewCount(@PathVariable String id) {
        return ResponseEntity.ok(videoService.getVideoViewCount(id));
    }

}
