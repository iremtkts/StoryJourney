package storyjourney.story_journey_backend.Model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.ServerTimestamp;


import lombok.Data;


@Data

public class View {

    @DocumentId
    private String viewId; 
    private DocumentReference userRef; 
    private DocumentReference videoRef; 

    @ServerTimestamp
    private Timestamp watchedAt;

    
    public View() {
    	
    }
    public String getViewId() {
		return viewId;
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
	
	public Timestamp getwatchedAt() {
		return watchedAt;
	}
	public void setwatchedAt(Timestamp watchedAt) {
		this.watchedAt = watchedAt;
	}
}