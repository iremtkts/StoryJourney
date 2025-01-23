import CoreData
import UIKit

class CoreDataService {
    static let shared = CoreDataService()
    
    private init() {}
    
    private var context: NSManagedObjectContext {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        return appDelegate.persistentContainer.viewContext
    }
    
    // MARK: - Videoyu Kaydetme
    func saveVideo(videoId: String, title: String, filePath: String) {
        let video = DownloadedVideo(context: context)
        video.videoId = videoId
        video.title = title
        video.filePath = filePath
        video.isDownloaded = true
        saveContext()
    }
    
    // MARK: - İndirilen Videoları Getirme
    func fetchDownloadedVideos() -> [DownloadedVideo] {
        let fetchRequest: NSFetchRequest<DownloadedVideo> = DownloadedVideo.fetchRequest()
        do {
            return try context.fetch(fetchRequest)
        } catch {
            print("Veriler getirilemedi: \(error.localizedDescription)")
            return []
        }
    }
    
    // MARK: - Context Kaydetme
    private func saveContext() {
        if context.hasChanges {
            do {
                try context.save()
                print("Veri kaydedildi.")
            } catch {
                print("Veri kaydedilemedi: \(error.localizedDescription)")
            }
        }
    }
}
