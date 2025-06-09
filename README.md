# Fake News Detection System

A comprehensive solution for community-driven fake news detection, including a Chrome extension and companion website.

## Overview

The Fake News Detection System is designed to combat misinformation online through a combination of community participation and expert verification. The system consists of three main components:

1. **Chrome Extension**: Allows users to flag potentially misleading content from any website or social media platform and receive real-time alerts about previously flagged content.

2. **Website Frontend**: Provides a platform for content submission, browsing flagged content, user account management, and system administration.

3. **Backend API**: Handles data storage, content verification workflows, authentication, and serves as the central hub connecting the extension and website.

## Key Features

### Chrome Extension
- Flag suspicious content from any website or social media platform
- Real-time alerts when viewing flagged content
- Works across all major platforms (Facebook, Twitter/X, Instagram, TikTok, Reddit, YouTube, LinkedIn, etc.)
- Simple, intuitive popup UI
- Regular synchronization with backend database

### Website
- Submit links or screenshots of suspicious content
- Browse and search through flagged content
- User accounts for submission tracking
- Admin/moderation dashboard
- Integration with Chrome extension

### Backend API
- Secure RESTful API
- User authentication and authorization
- Content submission and verification workflows
- Statistics and reporting
- Moderation tools

## Project Structure

```
fake-news-detection/
├── chrome-extension/       # Chrome extension source code
├── website/
│   ├── frontend/           # React frontend application
│   └── backend/            # Flask backend API
├── docs/                   # Documentation
└── README.md               # This file
```

## Technology Stack

- **Chrome Extension**: Manifest V3, HTML/CSS/JavaScript
- **Website Frontend**: React, Tailwind CSS, Shadcn UI
- **Backend API**: Flask (Python), SQLAlchemy, JWT authentication
- **Database**: SQLite (development), PostgreSQL (production)

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/example/fake-news-detection.git
   cd fake-news-detection
   ```

2. Set up the Chrome extension:
   ```bash
   cd chrome-extension
   npm install
   npm run build
   ```

3. Set up the website frontend:
   ```bash
   cd ../website/frontend
   npm install
   npm run dev
   ```

4. Set up the backend API:
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python src/main.py
   ```

For detailed setup instructions, see the [Installation Guide](docs/installation_guide.md).

## Documentation

- [Chrome Extension User Guide](docs/chrome_extension_user_guide.md)
- [Website User Guide](docs/website_user_guide.md)
- [Technical Documentation](docs/technical_documentation.md)
- [API Documentation](docs/api_documentation.md)
- [Deployment Instructions](docs/deployment_instructions.md)

## Development

### Chrome Extension Development

```bash
cd chrome-extension
npm install
npm run dev
```

Then load the `dist` directory as an unpacked extension in Chrome.

### Website Frontend Development

```bash
cd website/frontend
npm install
npm run dev
```

The development server will start at http://localhost:5173.

### Backend API Development

```bash
cd website/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python src/main.py
```

The API will be available at http://localhost:5000.

## Deployment

For production deployment instructions, see the [Deployment Guide](docs/deployment_instructions.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

## Contact

Project Link: [https://github.com/example/fake-news-detection](https://github.com/example/fake-news-detection)

Support: support@fakenewsdetector.example.com

