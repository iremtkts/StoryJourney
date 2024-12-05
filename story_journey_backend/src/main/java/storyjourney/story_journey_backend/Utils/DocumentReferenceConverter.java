package storyjourney.story_journey_backend.Utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.google.cloud.firestore.DocumentReference;
import com.google.firebase.cloud.FirestoreClient;

import java.io.IOException;

public class DocumentReferenceConverter {

    // Serializer: DocumentReference -> String
    public static class DocumentReferenceSerializer extends JsonSerializer<DocumentReference> {
        @Override
        public void serialize(DocumentReference value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeString(value.getPath());
        }
    }

    // Deserializer: String -> DocumentReference
    public static class DocumentReferenceDeserializer extends StdDeserializer<DocumentReference> {
        public DocumentReferenceDeserializer() {
            super(DocumentReference.class);
        }

        @Override
        public DocumentReference deserialize(com.fasterxml.jackson.core.JsonParser p, com.fasterxml.jackson.databind.DeserializationContext ctxt) throws IOException {
            String path = p.getText();
            return FirestoreClient.getFirestore().document(path);
        }
    }
}
