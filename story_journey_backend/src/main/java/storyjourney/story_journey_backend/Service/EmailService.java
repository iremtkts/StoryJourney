package storyjourney.story_journey_backend.Service;


import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("storyjourney23@gmail.com"); // Gönderen e-posta
            mailSender.send(message);
            System.out.println("E-posta başarıyla gönderildi.");
        } catch (Exception e) {
            System.err.println("E-posta gönderim hatası: " + e.getMessage());
        }
    }
}
