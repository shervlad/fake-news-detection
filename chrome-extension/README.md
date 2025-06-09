# Fake News Detector - Chrome Extension

A community-driven Chrome extension for detecting and flagging fake news and misinformation across the web.

## Features

- Flag potentially fake news or misinformation from any website or social media platform
- Receive real-time alerts when viewing content that has been flagged by the community
- Works across all major social media platforms (Facebook, Twitter/X, Instagram, TikTok, Reddit, YouTube, LinkedIn, etc.)
- Intuitive popup UI for flagging content and viewing status
- Customizable alert settings
- Synchronization with a central database of flagged content

## Installation

### Development Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/fake-news-detection.git
   cd fake-news-detection/chrome-extension
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Generate icons (if needed):
   ```
   node generate_icons.js
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `chrome-extension` directory

### Production Installation

Once published, the extension will be available on the Chrome Web Store:

1. Visit [Chrome Web Store](https://chrome.google.com/webstore) (link will be updated when published)
2. Click "Add to Chrome"
3. Follow the prompts to install the extension

## Usage

### Flagging Content

1. When you encounter potentially fake news or misinformation:
   - Click the extension icon in the toolbar
   - Select a reason for flagging from the dropdown
   - Add any additional details (optional)
   - Choose whether to include a screenshot
   - Click "Submit Flag"

2. Alternatively, right-click on the page and select "Flag as Fake News" from the context menu.

### Receiving Alerts

- When you visit a page that has been flagged by the community, you'll see an alert banner at the top of the page
- The alert will indicate whether the content has been verified as fake, misleading, or is pending review
- Click "View Details" on the alert to see more information

### Customizing Settings

1. Click the extension icon in the toolbar
2. Click the settings icon (gear) in the bottom-left corner
3. Or right-click the extension icon and select "Options"

In the options page, you can:
- Change the alert level (all flagged content, only verified content, only high-risk content, or none)
- Enable/disable automatic synchronization
- Change the sync interval
- Manually sync with the database
- Log in to your account or register a new one

## Development

### Project Structure

```
chrome-extension/
├── background/           # Background service worker
│   └── background.js
├── content/              # Content scripts injected into web pages
│   ├── content.js
│   └── content.css
├── images/               # Extension icons
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
├── options/              # Options page
│   ├── options.html
│   ├── options.css
│   └── options.js
├── popup/                # Popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── manifest.json         # Extension manifest
├── package.json          # NPM package configuration
└── README.md             # Documentation
```

### Key Components

1. **Manifest File**: Defines the extension's metadata, permissions, and components.
2. **Background Service Worker**: Handles background tasks, API communication, and state management.
3. **Content Scripts**: Injected into web pages to display alerts and provide flagging functionality.
4. **Popup UI**: The interface displayed when clicking the extension icon.
5. **Options Page**: Settings interface for customizing the extension.

### API Integration

The extension communicates with a backend API to:
- Submit flagged content
- Retrieve flagged content for alerts
- Synchronize data
- Manage user authentication

API endpoints are defined in the background service worker and can be configured for different environments.

### Building for Production

To build the extension for production:

1. Install dependencies:
   ```
   npm install
   ```

2. Build the extension:
   ```
   npm run build
   ```

3. The built extension will be in the `dist` directory, ready for submission to the Chrome Web Store.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

[MIT License](LICENSE)

## Privacy Policy

The extension collects the following data:
- URLs of pages you flag
- Reasons for flagging
- Screenshots (only if you choose to include them)

This data is used to:
- Identify potentially fake news or misinformation
- Alert other users about flagged content
- Improve the accuracy of the detection system

For more details, see the [Privacy Policy](https://fakenewsdetection.example.com/privacy).

## Contact

For questions, feedback, or support, please contact us at:
- Email: support@fakenewsdetection.example.com
- Website: https://fakenewsdetection.example.com/contact

