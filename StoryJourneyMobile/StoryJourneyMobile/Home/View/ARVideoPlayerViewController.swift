import UIKit
import SceneKit
import ARKit
import AVKit

class ARVideoPlayerViewController: UIViewController, ARSCNViewDelegate {
    private var sceneView = ARSCNView()
    private var videoFileName: String

    init(videoFileName: String) {
        self.videoFileName = videoFileName
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupSceneView()
        playVideoInAR()
    }

    private func setupSceneView() {
        sceneView.delegate = self
        sceneView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(sceneView)

        NSLayoutConstraint.activate([
            sceneView.topAnchor.constraint(equalTo: view.topAnchor),
            sceneView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            sceneView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            sceneView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])

        let configuration = ARWorldTrackingConfiguration()
        sceneView.session.run(configuration)
    }

    private func playVideoInAR() {
        // Video dosyasını Bundle'dan al
        guard let fileURL = Bundle.main.url(forResource: videoFileName, withExtension: "mp4") else {
            print("Video bulunamadı: \(videoFileName)")
            return
        }

        let player = AVPlayer(url: fileURL)

        // Videonun yansıtılacağı SCNPlane oluşturuluyor
        let videoPlane = SCNPlane(width: 1.0, height: 0.6)
        videoPlane.firstMaterial?.diffuse.contents = player
        videoPlane.firstMaterial?.isDoubleSided = true

        // SCNPlane bir SCNNode olarak sahneye ekleniyor
        let videoNode = SCNNode(geometry: videoPlane)
        videoNode.position = SCNVector3(0, 0, -1.0) // Kamera önünde yerleştiriliyor
        sceneView.scene.rootNode.addChildNode(videoNode)

        player.play()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        sceneView.session.pause()
    }
}
