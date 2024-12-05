package storyjourney.story_journey_backend.Dto;

import com.google.cloud.Timestamp;

import lombok.Data;

@Data
public class ViewDto {
    private String userRef; // Sadece path olarak tutulacak
    private String videoRef; // Sadece path olarak tutulacak
    private Timestamp watchedAt; // İzleme zamanı
	public String getUserRef() {
		return userRef;
	}
	public void setUserRef(String userRef) {
		this.userRef = userRef;
	}
	public String getVideoRef() {
		return videoRef;
	}
	public void setVideoRef(String videoRef) {
		this.videoRef = videoRef;
	}
	public Timestamp getWatchedAt() {
		return watchedAt;
	}
	public void setWatchedAt(Timestamp watchedAt) {
		this.watchedAt = watchedAt;
	}
}
