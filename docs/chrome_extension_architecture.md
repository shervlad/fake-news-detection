# Fake News Detection System - Chrome Extension Architecture

## Overview

This document details the architecture of the Chrome extension component of the Fake News Detection System. The extension is built using Manifest V3 and aims to provide a seamless user experience for flagging content and receiving real-time alerts.

## Technology Stack

- **Language**: JavaScript (ES6+)
- **Markup/Styling**: HTML5, CSS3
- **Framework/Libraries**: None (Vanilla JS for core logic, potentially a lightweight UI library for the popup if needed)
- **Build Tools**: Webpack (or similar) for bundling and managing dependencies
- **Manifest Version**: Manifest V3

## Core Components

The extension consists of the following key components:

### 1. Manifest File (`manifest.json`)

Defines the extension's metadata, permissions, background service worker, content scripts, popup, and other essential configurations.

**Key Manifest V3 Features Used:**

- **`manifest_version`**: 3
- **`background`**: Specifies the service worker (`service_worker`).
- **`content_scripts`**: Defines scripts injected into web pages.
- **`action`**: Configures the toolbar popup.
- **`permissions`**: Requests necessary permissions (e.g., `storage`, `activeTab`, `scripting`, `alarms`).
- **`host_permissions`**: Requests access to specific websites or `<all_urls>` for broad functionality.

### 2. Background Service Worker (`background.js`)

Handles background tasks, event listening, and communication between different parts of the extension. Replaces persistent background pages from Manifest V2.

**Responsibilities:**

- **Initialization**: Sets up initial state, alarms, and listeners on extension startup.
- **API Communication**: Handles all communication with the backend API (syncing flagged content, submitting flags).
- **State Management**: Manages the cached list of flagged URLs/domains and user settings.
- **Event Handling**: Listens for events like tab updates (`chrome.tabs.onUpdated`), messages from content scripts/popup (`chrome.runtime.onMessage`), and alarms (`chrome.alarms.onAlarm`).
- **Context Menu Integration**: Creates and manages context menu items for flagging selected text or images.
- **Real-time Alert Logic**: Determines when to show alerts based on current tab URL and cached data.
- **Periodic Sync**: Uses `chrome.alarms` API to schedule regular synchronization with the backend.

### 3. Content Scripts (`content_script.js`, `alert_ui.js`)

JavaScript files injected into web pages to interact with the DOM and communicate with the background service worker.

**Responsibilities:**

- **DOM Interaction**: Analyzes page content (URL, potentially specific elements on social media platforms) to identify content for flagging.
- **Flagging Trigger**: Adds UI elements (e.g., a small flag icon next to posts/articles) or listens for user actions (e.g., right-click) to initiate the flagging process.
- **Alert Display**: Injects and manages the UI for real-time alerts (banners, overlays) when flagged content is detected on the current page. This might involve a separate script (`alert_ui.js`) focused solely on the alert UI.
- **Message Passing**: Communicates with the background service worker to send flagging requests and receive instructions for displaying alerts.
- **Platform Adaptation**: Contains logic to adapt its behavior based on the specific website or social media platform being viewed (e.g., identifying post containers on Facebook vs. Twitter).

### 4. Popup UI (`popup.html`, `popup.js`, `popup.css`)

The user interface displayed when the user clicks the extension icon in the Chrome toolbar.

**Responsibilities:**

- **Current Page Status**: Displays whether the current page/content is flagged and its verification status.
- **Manual Flagging**: Provides a form for the user to manually flag the current page or specific content, adding details like reason and comments.
- **Quick Settings**: Allows users to adjust basic settings (e.g., enable/disable alerts).
- **Link to Website**: Provides a link to the main companion website for more detailed information or moderation.
- **User Authentication Status**: Shows if the user is logged in (if user accounts are implemented).
- **Message Passing**: Communicates with the background service worker to get page status and submit flags.

### 5. Options Page (`options.html`, `options.js`, `options.css`) (Optional)

A dedicated page for more detailed configuration and settings.

**Responsibilities:**

- **Detailed Settings**: Configure alert levels, sync frequency, notification preferences.
- **Account Management**: Login/logout functionality, link to profile on the main website.
- **Manage Blocklist/Allowlist**: Allow users to customize domains where alerts are shown or hidden.
- **View Sync Status**: Show last sync time and potential errors.

### 6. Storage (`chrome.storage.local`, `chrome.storage.sync`)

Used for persisting data.

- **`chrome.storage.local`**: Stores larger amounts of data like the cached list of flagged URLs/domains, potentially full content details for offline access.
- **`chrome.storage.sync`**: Stores user settings and preferences that should be synced across devices (requires user login to Chrome).

## Workflow Examples

### 1. User Flags Content via Popup

1.  User clicks the extension icon.
2.  `popup.js` requests current tab information from the background service worker.
3.  Popup UI displays current page status (if known).
4.  User fills the flagging form in `popup.html`.
5.  `popup.js` sends a message to `background.js` with the flag details (URL, reason, etc.).
6.  `background.js` receives the message and makes an API call to `POST /extension/flag`.
7.  Backend processes the flag and stores it.
8.  `background.js` receives confirmation from the API.
9.  `background.js` updates local storage and potentially sends a confirmation message back to `popup.js`.
10. Popup UI updates to show the flag was submitted.

### 2. User Flags Content via Content Script (e.g., Right-Click)

1.  User right-clicks on a specific element (e.g., a social media post).
2.  `background.js` (via context menu listener) or `content_script.js` (if using injected buttons) captures the event and relevant content data (URL, text snippet).
3.  A message is sent to `background.js` with the flag details.
4.  (Steps 6-8 from Popup workflow)
5.  `background.js` might send a message to `content_script.js` to display a temporary confirmation near the flagged element.

### 3. Real-time Alert Display

1.  User navigates to a new URL or a page updates.
2.  `chrome.tabs.onUpdated` event fires in `background.js`.
3.  `background.js` checks the URL against its cached list of flagged URLs/domains stored in `chrome.storage.local`.
4.  If a match is found (and meets user's alert preferences):
    a.  `background.js` sends a message to the `content_script.js` for that tab, instructing it to display an alert.
    b.  The message includes details like verification status and score.
5.  `content_script.js` (specifically `alert_ui.js`) receives the message and injects/shows the alert banner/overlay on the page.

### 4. Periodic Sync

1.  `chrome.alarms.create` sets up a recurring alarm (e.g., every 30 minutes) in `background.js`.
2.  `chrome.alarms.onAlarm` listener fires when the alarm triggers.
3.  `background.js` makes an API call to `POST /extension/sync` (or a GET endpoint designed for fetching updates).
4.  Backend returns the latest list of flagged URLs/domains or updates since the last sync.
5.  `background.js` updates the data in `chrome.storage.local`.

## Security Considerations (Manifest V3)

- **Limited Background Persistence**: Service workers are event-driven and terminate when idle, reducing resource usage but requiring careful state management.
- **Scripting API**: Use `chrome.scripting.executeScript` instead of the older `chrome.tabs.executeScript` for injecting content scripts programmatically.
- **Restricted Permissions**: Request only necessary permissions. Use `activeTab` where possible instead of broad host permissions.
- **Cross-Origin Requests**: All API calls from the service worker are subject to CORS rules defined on the backend.
- **Content Security Policy (CSP)**: Define a strict CSP in `manifest.json` to mitigate XSS attacks.

## Platform Adaptation Strategy

To work across diverse websites and social media platforms, the content scripts will need specific logic:

1.  **URL Matching**: Use `matches` in `manifest.json` to target specific platforms (e.g., `*://*.facebook.com/*`, `*://*.twitter.com/*`) with tailored scripts, or use a single script with conditional logic based on `window.location.hostname`.
2.  **DOM Element Identification**: Use robust CSS selectors or potentially `MutationObserver` to identify relevant content elements (posts, articles, comments, ads) on different platforms. This is the most challenging part and will require ongoing maintenance as platforms update their structure.
3.  **Data Extraction**: Extract relevant data (post URL, author, text content) from identified elements.
4.  **UI Injection Points**: Determine appropriate places within the page structure to inject flagging buttons or alert banners without breaking the site's layout.

## Build and Packaging

- Use Webpack or a similar bundler to manage modules, minify code, and package the extension into a zip file for distribution via the Chrome Web Store or direct installation.

