package storyjourney.story_journey_backend.Dto;

import jakarta.validation.constraints.NotBlank;

public class ResetPasswordRequestDto {
    
    @NotBlank(message = "Email cannot be empty.")
    private String email;

    @NotBlank(message = "Token cannot be empty.")
    private String token;

    @NotBlank(message = "New password cannot be empty.")
    private String newPassword;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

    // Getters and Setters
}
