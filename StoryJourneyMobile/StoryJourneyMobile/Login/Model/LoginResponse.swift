import Foundation

struct LoginResponse: Codable {
    let role: String
    let token: String
    let message: String
}
