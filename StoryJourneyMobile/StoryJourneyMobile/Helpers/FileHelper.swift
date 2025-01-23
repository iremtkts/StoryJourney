
import Foundation

class FileHelper {
    static func getVideoFilePath(videoId: String) -> String {
        let fileManager = FileManager.default
        let documentsDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        return documentsDirectory.appendingPathComponent("\(videoId).mp4").path
    }
}
