import UIKit

class LoginViewController: UIViewController {
    
    // UI Bileşenleri
    private let backgroundImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.image = UIImage(named: "background")
        imageView.contentMode = .scaleAspectFill
        imageView.translatesAutoresizingMaskIntoConstraints = false
        return imageView
    }()
    
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.text = "Hikaye Yolculuğu"
        label.textColor = .white
        label.font = UIFont(name: "SnellRoundhand-Bold", size: 44)
        label.textAlignment = .center
        label.numberOfLines = 0
        label.layer.shadowColor = UIColor.black.cgColor
        label.layer.shadowOffset = CGSize(width: 1, height: 1)
        label.layer.shadowOpacity = 0.5
        label.layer.shadowRadius = 2
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let emailTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Email"
        textField.backgroundColor = .white
        textField.layer.cornerRadius = 8
        textField.layer.borderWidth = 1
        textField.layer.borderColor = UIColor.lightGray.cgColor
        textField.setLeftPaddingPoints(10)
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    private let passwordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Şifre"
        textField.isSecureTextEntry = true
        textField.backgroundColor = .white
        textField.layer.cornerRadius = 8
        textField.layer.borderWidth = 1
        textField.layer.borderColor = UIColor.lightGray.cgColor
        textField.setLeftPaddingPoints(10)
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    private let loginButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Giriş Yap", for: .normal)
        button.backgroundColor = UIColor.systemPink
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 8
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    private let errorLabel: UILabel = {
        let label = UILabel()
        label.text = "Hata mesajı"
        label.textColor = .red
        label.font = UIFont.systemFont(ofSize: 14)
        label.isHidden = true
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupBindings()
    }
    
    private func setupUI() {
            // Arka plan
            view.addSubview(backgroundImageView)
            NSLayoutConstraint.activate([
                backgroundImageView.topAnchor.constraint(equalTo: view.topAnchor),
                backgroundImageView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
                backgroundImageView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
                backgroundImageView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
            ])
            
            // Başlık
            view.addSubview(titleLabel)
            NSLayoutConstraint.activate([
                titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 50),
                titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
                titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
            ])
            
            // Email TextField
            view.addSubview(emailTextField)
            NSLayoutConstraint.activate([
                emailTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                emailTextField.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -50),
                emailTextField.widthAnchor.constraint(equalToConstant: 350),
                emailTextField.heightAnchor.constraint(equalToConstant: 50)
            ])
            
            // Password TextField
            view.addSubview(passwordTextField)
            NSLayoutConstraint.activate([
                passwordTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                passwordTextField.topAnchor.constraint(equalTo: emailTextField.bottomAnchor, constant: 20),
                passwordTextField.widthAnchor.constraint(equalToConstant: 350),
                passwordTextField.heightAnchor.constraint(equalToConstant: 50)
            ])
            
            // Login Button
            view.addSubview(loginButton)
            NSLayoutConstraint.activate([
                loginButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                loginButton.topAnchor.constraint(equalTo: passwordTextField.bottomAnchor, constant: 30),
                loginButton.widthAnchor.constraint(equalToConstant: 350),
                loginButton.heightAnchor.constraint(equalToConstant: 50)
            ])
        }
    
    private func setupBindings() {
        emailTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        passwordTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        loginButton.addTarget(self, action: #selector(loginButtonTapped), for: .touchUpInside)
    }
    
    @objc private func textFieldDidChange() {
        
        loginButton.isEnabled = !(emailTextField.text?.isEmpty ?? true) && !(passwordTextField.text?.isEmpty ?? true)
    }
    
    @objc private func loginButtonTapped() {
        print("Giriş yapıldı: Email: \(emailTextField.text ?? ""), Şifre: \(passwordTextField.text ?? "")")
        // Giriş işlemleri burada yapılacak
    }
}
