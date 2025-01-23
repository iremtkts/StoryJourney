import Foundation

struct ARVideo: Codable {
    let videoId: String
    let title: String
    let description: String
    var url: String
    let ageGroup: String
    let isPremium: Bool
}
