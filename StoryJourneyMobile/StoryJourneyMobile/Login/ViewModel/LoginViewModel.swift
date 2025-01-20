import Foundation

class LoginViewModel {
    var email: String = ""
    var password: String = ""
    
    var isLoginButtonEnabled: Bool {
        return !email.isEmpty && !password.isEmpty
    }
    
    func login(completion: @escaping (Bool, String?) -> Void) {
        guard let url = URL(string: "http://localhost:8080/api/auth/login") else {
            completion(false, "API URL'si geçersiz.")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body, options: [])
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(false, "Hata: \(error.localizedDescription)")
                return
            }
            
            guard let data = data else {
                completion(false, "Sunucudan yanıt alınamadı.")
                return
            }
            
            do {
                guard let jsonResponse = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                    completion(false, "Sunucudan geçersiz veri döndü.")
                    return
                }

                if let token = jsonResponse["token"] as? String {
                    // Token'i kaydet
                    UserDefaults.standard.set(token, forKey: "authToken")
                    completion(true, nil)
                } else {
                    let message = jsonResponse["message"] as? String ?? "Bilinmeyen hata."
                    completion(false, message)
                }
            } catch {
                completion(false, "Veri işlenirken hata oluştu: \(error.localizedDescription)")
            }

        }
        task.resume()
    }
}
