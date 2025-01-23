import Foundation

class HomeViewModel {
    private var downloadedVideos: [DownloadedVideo] = []
    private var allVideos: [ARVideo] = []
    
    var onDataUpdated: (() -> Void)?
    var onError: ((String) -> Void)? // Hata bağlaması

    init() {
        downloadedVideos = CoreDataService.shared.fetchDownloadedVideos()
        for video in downloadedVideos {
            let filePath = FileHelper.getVideoFilePath(videoId: video.videoId!)
            if !FileManager.default.fileExists(atPath: filePath) {
                print("İndirilen video bulunamadı, silinmiş olabilir: \(filePath)")
            }
        }
    }

    
    var numberOfVideos: Int {
        return allVideos.count
    }
    
    func video(at index: Int) -> ARVideo {
        return allVideos[index]
    }
    
    func fetchARVideos() {
        APIService.shared.fetchARVideos { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let videos):
                    self?.allVideos = videos
                    self?.onDataUpdated?()
                case .failure(let error):
                    self?.onError?(error.localizedDescription)
                }
            }
        }
    }
    
    func isVideoDownloaded(videoId: String) -> Bool {
        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let filePath = documentsDirectory.appendingPathComponent("\(videoId).mp4").path
        
        // Dosya varlığını kontrol et
        if FileManager.default.fileExists(atPath: filePath) {
            print("Video mevcut: \(filePath)")
            return true
        } else {
            print("Video bulunamadı: \(filePath)")
            return false
        }
    }

    
    func downloadVideo(video: ARVideo, filePath: String, completion: @escaping (Bool) -> Void) {
        // Core Data'dan gelen URL string'ini URL nesnesine dönüştürme
        guard let videoURL = URL(string: video.url) else {
            print("Geçersiz URL: \(video.url)")
            completion(false)
            return
        }

        // APIService üzerinden indirme işlemi
        APIService.shared.downloadVideo(from: videoURL, to: filePath) { [weak self] success in
            if success {
                CoreDataService.shared.saveVideo(videoId: video.videoId, title: video.title, filePath: filePath)
                self?.downloadedVideos = CoreDataService.shared.fetchDownloadedVideos()
            }
            completion(success)
        }
    }
    
    func getDownloadedVideoPath(videoId: String) -> String? {
        guard let video = downloadedVideos.first(where: { $0.videoId == videoId }) else {
            return nil
        }
        return video.filePath
    }
}
