import UIKit

class HomeViewController: UIViewController {
    
    private let viewModel = HomeViewModel()
    private let tableView = UITableView()
    private let errorLabel = UILabel()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupBindings()
        viewModel.fetchARVideos()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        navigationItem.title = "Hikaye Yolculuğu"
        navigationController?.navigationBar.titleTextAttributes = [
            .foregroundColor: UIColor.systemPink,
            .font: UIFont.boldSystemFont(ofSize: 18)
        ]

        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(VideoTableViewCell.self, forCellReuseIdentifier: "VideoCell")
        tableView.backgroundColor = .clear
        view.addSubview(tableView)

        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }

    
    private func setupBindings() {
        viewModel.onDataUpdated = { [weak self] in
            DispatchQueue.main.async {
                self?.tableView.reloadData()
            }
        }
    }
}

extension HomeViewController: UITableViewDataSource, UITableViewDelegate, VideoTableViewCellDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return viewModel.numberOfVideos
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "VideoCell", for: indexPath) as? VideoTableViewCell else {
            return UITableViewCell()
        }
        let video = viewModel.video(at: indexPath.row)
        let isDownloaded = viewModel.isVideoDownloaded(videoId: video.videoId)
        cell.configure(with: video, isDownloaded: isDownloaded)
        cell.delegate = self
        return cell
    }
    
    func didTapDownloadButton(forCell cell: VideoTableViewCell) {
        guard let indexPath = tableView.indexPath(for: cell) else { return }
        let video = viewModel.video(at: indexPath.row)
        
        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let filePath = documentsDirectory.appendingPathComponent("\(video.videoId).mp4").path
        
        viewModel.downloadVideo(video: video, filePath: filePath) { [weak self] success in
            DispatchQueue.main.async {
                if success {
                    self?.tableView.reloadRows(at: [indexPath], with: .automatic)
                } else {
                    self?.showAlert(title: "Hata", message: "Video indirilemedi.")
                }
            }
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // Burada Bundle'dan oynatılacak video dosyasını seçiyoruz
        let videoFileName = "1" // Projeye eklediğiniz video dosyasının ismi (uzantısız)
        
        // ARVideoPlayerViewController'ı başlatıyoruz
        let arPlayerVC = ARVideoPlayerViewController(videoFileName: videoFileName)
        navigationController?.pushViewController(arPlayerVC, animated: true)
    }



    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Tamam", style: .default, handler: nil))
        present(alert, animated: true)
    }
}
