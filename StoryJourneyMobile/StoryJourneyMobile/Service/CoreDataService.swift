//
//  CoreDataService 2.swift
//  StoryJourneyMobile
//
//  Created by iremt on 21.01.2025.
//


import CoreData
import UIKit

class CoreDataService {
    static let shared = CoreDataService()
    
    private init() {}
    
    private var context: NSManagedObjectContext {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        return appDelegate.persistentContainer.viewContext
    }
    
    // MARK: - Veri Kaydetme
    func saveVideo(videoId: String, title: String, filePath: String) {
        let video = DownloadedVideo(context: context)
        video.videoId = videoId
        video.title = title
        video.filePath = filePath
        video.isDownloaded = true
        saveContext()
    }
    
    // MARK: - Veri Getirme
    func fetchAllVideos() -> [DownloadedVideo] {
        let fetchRequest: NSFetchRequest<DownloadedVideo> = DownloadedVideo.fetchRequest()
        do {
            return try context.fetch(fetchRequest)
        } catch {
            print("Veriler getirilemedi: \(error.localizedDescription)")
            return []
        }
    }
    
    // MARK: - Veri Silme
    func deleteVideo(video: DownloadedVideo) {
        context.delete(video)
        saveContext()
    }
    
    // MARK: - Context Kaydetme
    private func saveContext() {
        if context.hasChanges {
            do {
                try context.save()
                print("Veriler başarıyla kaydedildi.")
            } catch {
                print("Veriler kaydedilemedi: \(error.localizedDescription)")
            }
        }
    }
}
