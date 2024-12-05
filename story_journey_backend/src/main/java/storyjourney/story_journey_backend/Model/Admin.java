package storyjourney.story_journey_backend.Model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.ServerTimestamp;


import lombok.Data;


@Data
public class Admin {

    @DocumentId
    private String adminId;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Boolean isActive = true;
    
   

    @ServerTimestamp
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    public Admin() {
    	
    }
    public String getAdminId() {
		return adminId;
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
	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	/**
	 * @return the isActive
	 */
	public Boolean getIsActive() {
		return isActive;
	}
	/**
	 * @param isActive the isActive to set
	 */
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	/**
	 * @return the updatedAt
	 */
	public Timestamp getcreatedAt() {
		return createdAt;
	}
	/**
	 * @param updatedAt the updatedAt to set
	 */
	public void setcreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}
	public Timestamp getUpdatedAt() {
		return updatedAt;
	}
	/**
	 * @param updatedAt the updatedAt to set
	 */
	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}
    
}