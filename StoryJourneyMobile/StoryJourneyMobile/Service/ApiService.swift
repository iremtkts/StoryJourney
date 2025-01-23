import Foundation

class APIService {
    static let shared = APIService()

    private init() {}

    func fetchARVideos(completion: @escaping (Result<[ARVideo], Error>) -> Void) {
        guard let url = URL(string: "http://localhost:8080/videos") else {
            completion(.failure(NSError(domain: "", code: 404, userInfo: [NSLocalizedDescriptionKey: "Geçersiz URL"])))
            return
        }
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: 500, userInfo: [NSLocalizedDescriptionKey: "Veri alınamadı"])))
                return
            }
            
            do {
                let videos = try JSONDecoder().decode([ARVideo].self, from: data)
                completion(.success(videos))
            } catch {
                completion(.failure(error))
            }
        }
        task.resume()
    }

    func downloadVideo(from downloadURL: URL, to destinationPath: String, completion: @escaping (Bool) -> Void) {
        let task = URLSession.shared.downloadTask(with: downloadURL) { tempLocalURL, response, error in
            guard let tempLocalURL = tempLocalURL, error == nil else {
                print("İndirme hatası: \(error?.localizedDescription ?? "Bilinmeyen hata")")
                completion(false)
                return
            }

            do {
                let destinationURL = URL(fileURLWithPath: destinationPath)
                if FileManager.default.fileExists(atPath: destinationURL.path) {
                    try FileManager.default.removeItem(at: destinationURL)
                }
                try FileManager.default.moveItem(at: tempLocalURL, to: destinationURL)
                
               
                if FileManager.default.fileExists(atPath: destinationURL.path) {
                    print("Video başarıyla kaydedildi: \(destinationURL.path)")
                } else {
                    print("Video kaydedilemedi.")
                }
                
                completion(true)
            } catch {
                print("Dosya taşınırken hata: \(error.localizedDescription)")
                completion(false)
            }
        }
        task.resume()
    }

}
