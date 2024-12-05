package storyjourney.story_journey_backend.Model;


import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.ServerTimestamp;


import lombok.Data;


@Data

public class User {

    @DocumentId
    private String userId;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Boolean isEmailVerified = false;
    private String emailVerificationToken;
    private Status status = Status.PENDING;
   

    @ServerTimestamp
    private Timestamp createdAt; 
    private Timestamp updatedAt;
	
    public User() {
    	
    }
    public String getUserId() {
		return userId;
	}
    public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Boolean getIsEmailVerified() {
		return isEmailVerified;
	}
	public void setIsEmailVerified(Boolean isEmailVerified) {
		this.isEmailVerified = isEmailVerified;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmailVerificationToken() {
		return emailVerificationToken;
	}
	public void setEmailVerificationToken(String emailVerificationToken) {
		this.emailVerificationToken = emailVerificationToken;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public Timestamp getcreatedAt() {
		return createdAt;
	}
	public void setcreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	} 
	public Timestamp getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	} 



}
