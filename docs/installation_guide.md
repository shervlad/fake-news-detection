# Fake News Detection System - Installation Guide

This guide provides detailed instructions for setting up the Fake News Detection System development environment on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Chrome Extension Setup](#chrome-extension-setup)
4. [Website Frontend Setup](#website-frontend-setup)
5. [Backend API Setup](#backend-api-setup)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before beginning installation, ensure you have the following installed on your system:

### Required Software

- **Git**: Version control system
  - [Download Git](https://git-scm.com/downloads)
  - Verify installation: `git --version`

- **Node.js**: JavaScript runtime (v16.0.0 or higher)
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version`
  - Verify npm: `npm --version`

- **Python**: Programming language (v3.8 or higher)
  - [Download Python](https://www.python.org/downloads/)
  - Verify installation: `python --version` or `python3 --version`

- **Chrome Browser**: For extension development and testing
  - [Download Chrome](https://www.google.com/chrome/)

### Recommended Tools

- **Visual Studio Code**: Code editor with extensions for JavaScript and Python
  - [Download VS Code](https://code.visualstudio.com/)
  - Recommended extensions:
    - ESLint
    - Prettier
    - Python
    - React Developer Tools

- **Postman**: API testing tool
  - [Download Postman](https://www.postman.com/downloads/)

## Clone the Repository

1. Open a terminal or command prompt
2. Navigate to the directory where you want to store the project
3. Clone the repository:

```bash
git clone https://github.com/example/fake-news-detection.git
cd fake-news-detection
```

## Chrome Extension Setup

### Installation

1. Navigate to the chrome-extension directory:

```bash
cd chrome-extension
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build
```

This will create a `dist` directory with the built extension.

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked"
4. Select the `dist` directory from the chrome-extension folder
5. The extension should now appear in your extensions list and in the toolbar

### Development Mode

For development with hot reloading:

```bash
npm run dev
```

This will watch for changes and rebuild the extension automatically. You'll need to refresh the extension in `chrome://extensions/` after changes.

## Website Frontend Setup

### Installation

1. Navigate to the website frontend directory:

```bash
cd ../website/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The website should now be running at [http://localhost:5173](http://localhost:5173).

### Configuration

Create a `.env` file in the frontend directory with the following content:

```
VITE_API_URL=http://localhost:5000/api
```

This configures the frontend to connect to the local backend API.

## Backend API Setup

### Installation

1. Navigate to the website backend directory:

```bash
cd ../backend
```

2. Create and activate a virtual environment:

```bash
# On macOS/Linux
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following content:

```
# Database configuration
DB_USERNAME=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fake_news_detector

# JWT configuration
JWT_SECRET_KEY=development_secret_key
JWT_ACCESS_TOKEN_EXPIRES=86400
JWT_REFRESH_TOKEN_EXPIRES=2592000

# API configuration
API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:5173
```

5. Initialize the database:

```bash
python src/seed_db.py
```

6. Start the API server:

```bash
python src/main.py
```

The API should now be running at [http://localhost:5000](http://localhost:5000).

## Development Workflow

### Chrome Extension Development

1. Make changes to the extension code
2. Run `npm run build` or use `npm run dev` for automatic rebuilding
3. Refresh the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension
   - Or reload the extension by clicking "Update"

### Website Frontend Development

1. Make changes to the frontend code
2. The development server will automatically reload with your changes
3. Access the website at [http://localhost:5173](http://localhost:5173)

### Backend API Development

1. Make changes to the backend code
2. Restart the Flask server to apply changes:
   - Stop the server with Ctrl+C
   - Start it again with `python src/main.py`
3. For database schema changes, you may need to re-run `python src/seed_db.py`

### Full-Stack Testing

To test the entire system:
1. Ensure the backend API is running
2. Ensure the frontend development server is running
3. Load the Chrome extension in your browser
4. Test features across all components

## Troubleshooting

### Chrome Extension Issues

**Problem**: Extension not loading or updating
- **Solution**: Check for errors in the Chrome DevTools console. Open the extension popup, right-click, and select "Inspect" to view console output.

**Problem**: Content scripts not working
- **Solution**: Ensure the manifest.json has the correct permissions and content script matches.

### Website Frontend Issues

**Problem**: API connection errors
- **Solution**: Verify the API URL in the .env file and ensure the backend server is running.

**Problem**: Components not rendering correctly
- **Solution**: Check the browser console for React errors and verify component props.

### Backend API Issues

**Problem**: Database connection errors
- **Solution**: Verify database credentials in the .env file and ensure the database server is running.

**Problem**: API endpoints returning errors
- **Solution**: Check the Flask server logs for detailed error messages.

**Problem**: JWT authentication issues
- **Solution**: Ensure the JWT_SECRET_KEY is set correctly and tokens are being properly generated and validated.

### General Issues

**Problem**: Dependencies not installing
- **Solution**: Try clearing npm or pip cache and reinstalling.
  ```bash
  # For npm
  npm cache clean --force
  npm install
  
  # For pip
  pip cache purge
  pip install -r requirements.txt
  ```

**Problem**: Port conflicts
- **Solution**: Change the port in the configuration if another application is using the default port.

## Next Steps

After successful installation, refer to these resources:

- [Chrome Extension User Guide](chrome_extension_user_guide.md)
- [Website User Guide](website_user_guide.md)
- [Technical Documentation](technical_documentation.md)
- [API Documentation](api_documentation.md)

For any additional help, please contact the development team or open an issue on the project's GitHub repository.

