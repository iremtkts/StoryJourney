import Foundation

class LinkConverter {
    static func convertToDirectDownloadLink(_ sharingLink: String) -> URL? {
      
        guard let fileID = sharingLink
            .split(separator: "/")
            .dropFirst(3)
            .first(where: { part in
                let partString = String(part)
                return partString != "file" && partString != "d"
            }) else {
            return nil
        }

     
        let directDownloadLink = "https://drive.google.com/uc?export=download&id=\(fileID)"
        return URL(string: directDownloadLink)
    }
}
