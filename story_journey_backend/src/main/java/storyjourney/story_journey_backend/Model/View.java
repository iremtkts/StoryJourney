package storyjourney.story_journey_backend.Model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.ServerTimestamp;

import lombok.Data;
import storyjourney.story_journey_backend.Utils.DocumentReferenceConverter;


@Data
public class View {
    @DocumentId
    private String viewId;

	@JsonSerialize(using = DocumentReferenceConverter.DocumentReferenceSerializer.class)
    @JsonDeserialize(using = DocumentReferenceConverter.DocumentReferenceDeserializer.class)
    private DocumentReference userRef;

    @JsonSerialize(using = DocumentReferenceConverter.DocumentReferenceSerializer.class)
    @JsonDeserialize(using = DocumentReferenceConverter.DocumentReferenceDeserializer.class)
    private DocumentReference videoRef;

    @ServerTimestamp
    private Timestamp watchedAt;
    
    public String getViewId() {
		return viewId;
	}

	public void setViewId(String viewId) {
		this.viewId = viewId;
	}

	public DocumentReference getUserRef() {
		return userRef;
	}

	public void setUserRef(DocumentReference userRef) {
		this.userRef = userRef;
	}

	public DocumentReference getVideoRef() {
		return videoRef;
	}

	public void setVideoRef(DocumentReference videoRef) {
		this.videoRef = videoRef;
	}

	public Timestamp getWatchedAt() {
		return watchedAt;
	}

	public void setWatchedAt(Timestamp watchedAt) {
		this.watchedAt = watchedAt;
	}
}
