import UIKit

protocol VideoTableViewCellDelegate: AnyObject {
    func didTapDownloadButton(forCell cell: VideoTableViewCell)
}

class VideoTableViewCell: UITableViewCell {
    
    weak var delegate: VideoTableViewCellDelegate?
    private let titleLabel = UILabel()
    private let downloadButton = UIButton(type: .system)
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        titleLabel.textColor = .label
        titleLabel.font = UIFont.preferredFont(forTextStyle: .body)
        titleLabel.adjustsFontForContentSizeCategory = true

        downloadButton.tintColor = .systemPink

        contentView.addSubview(titleLabel)
        contentView.addSubview(downloadButton)

        NSLayoutConstraint.activate([
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            titleLabel.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            downloadButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            downloadButton.centerYAnchor.constraint(equalTo: contentView.centerYAnchor)
        ])
    }

    
    func configure(with video: ARVideo, isDownloaded: Bool) {
        titleLabel.text = video.title
        let icon = isDownloaded ? "checkmark.circle" : "arrow.down.circle"
        downloadButton.setImage(UIImage(systemName: icon), for: .normal)
    }
    
    @objc private func didTapDownload() {
        delegate?.didTapDownloadButton(forCell: self)
    }
}
