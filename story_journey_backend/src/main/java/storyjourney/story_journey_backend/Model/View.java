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
}
