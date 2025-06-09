// Constants
const ALERT_TYPES = {
  VERIFIED_FAKE: 'verified_fake',
  VERIFIED_MISLEADING: 'verified_misleading',
  PENDING: 'pending',
  DOMAIN_WARNING: 'domain_warning'
};

// State
let alertShown = false;
let currentUrl = window.location.href;
let alertContainer = null;

// Initialize content script
function initialize() {
  console.log('Fake News Detector: Content script initialized');
  
  // Create a container for alerts if needed
  createAlertContainer();
  
  // Listen for messages from background script
  setupMessageListener();
  
  // Add platform-specific adaptations
  adaptToPlatform();
}

// Create container for alerts
function createAlertContainer() {
  // Check if container already exists
  if (document.getElementById('fake-news-detector-alert-container')) {
    return;
  }
  
  // Create container
  alertContainer = document.createElement('div');
  alertContainer.id = 'fake-news-detector-alert-container';
  
  // Apply styles
  Object.assign(alertContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: '2147483647', // Highest possible z-index
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    display: 'none' // Hidden by default
  });
  
  // Add to document
  document.body.appendChild(alertContainer);
}

// Set up message listener
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Fake News Detector: Content script received message', message);
    
    if (message.action === 'showAlert' && message.data) {
      showAlert(message.data);
      sendResponse({ success: true });
    }
    
    // Return true to indicate we'll respond asynchronously
    return true;
  });
}

// Show alert for flagged content
function showAlert(flagData) {
  // Don't show multiple alerts
  if (alertShown) {
    return;
  }
  
  console.log('Fake News Detector: Showing alert', flagData);
  
  // Determine alert type
  let alertType = ALERT_TYPES.PENDING;
  if (flagData.verificationStatus === 'verified_fake') {
    alertType = ALERT_TYPES.VERIFIED_FAKE;
  } else if (flagData.verificationStatus === 'verified_misleading') {
    alertType = ALERT_TYPES.VERIFIED_MISLEADING;
  } else if (flagData.domain && !flagData.contentId) {
    alertType = ALERT_TYPES.DOMAIN_WARNING;
  }
  
  // Create alert content
  const alertContent = createAlertContent(alertType, flagData);
  
  // Add to container
  alertContainer.innerHTML = alertContent;
  alertContainer.style.display = 'block';
  
  // Add event listeners
  setupAlertEventListeners();
  
  // Mark as shown
  alertShown = true;
}

// Create alert content based on type
function createAlertContent(alertType, flagData) {
  // Base styles as CSS string
  const baseStyles = `
    .fnd-alert {
      width: 100%;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: fnd-slide-down 0.3s ease-out;
      box-sizing: border-box;
    }
    
    .fnd-alert-content {
      display: flex;
      align-items: center;
      flex: 1;
    }
    
    .fnd-alert-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .fnd-alert-text {
      flex: 1;
    }
    
    .fnd-alert-title {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .fnd-alert-message {
      font-size: 14px;
    }
    
    .fnd-alert-actions {
      display: flex;
      align-items: center;
    }
    
    .fnd-alert-button {
      background: transparent;
      border: 1px solid currentColor;
      border-radius: 4px;
      padding: 6px 12px;
      margin-left: 8px;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
    }
    
    .fnd-alert-close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0 8px;
      margin-left: 16px;
      opacity: 0.7;
    }
    
    .fnd-alert-close:hover {
      opacity: 1;
    }
    
    @keyframes fnd-slide-down {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `;
  
  // Alert-specific content
  let alertClass = '';
  let iconHtml = '';
  let titleText = '';
  let messageText = '';
  let actionButtonHtml = '';
  
  switch (alertType) {
    case ALERT_TYPES.VERIFIED_FAKE:
      alertClass = 'fnd-alert-fake';
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
      titleText = 'Warning: Verified Fake News';
      messageText = 'This content has been verified as false by fact-checkers.';
      actionButtonHtml = '<button class="fnd-alert-button fnd-alert-details">View Details</button>';
      break;
      
    case ALERT_TYPES.VERIFIED_MISLEADING:
      alertClass = 'fnd-alert-misleading';
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      titleText = 'Caution: Misleading Content';
      messageText = 'This content contains misleading information that may be deceptive.';
      actionButtonHtml = '<button class="fnd-alert-button fnd-alert-details">View Details</button>';
      break;
      
    case ALERT_TYPES.DOMAIN_WARNING:
      alertClass = 'fnd-alert-domain';
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      titleText = 'Caution: Questionable Source';
      messageText = `This website (${flagData.domain}) has been flagged multiple times for sharing misinformation.`;
      actionButtonHtml = '<button class="fnd-alert-button fnd-alert-details">Learn More</button>';
      break;
      
    default: // PENDING
      alertClass = 'fnd-alert-pending';
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      titleText = 'Content Flagged';
      messageText = 'This content has been flagged by our community and is under review.';
      actionButtonHtml = '';
  }
  
  // Alert-specific styles
  let alertStyles = '';
  switch (alertType) {
    case ALERT_TYPES.VERIFIED_FAKE:
      alertStyles = `
        .fnd-alert-fake {
          background-color: #FFEBEE;
          color: #C62828;
          border-bottom: 1px solid #FFCDD2;
        }
      `;
      break;
      
    case ALERT_TYPES.VERIFIED_MISLEADING:
      alertStyles = `
        .fnd-alert-misleading {
          background-color: #FFF8E1;
          color: #F57F17;
          border-bottom: 1px solid #FFE082;
        }
      `;
      break;
      
    case ALERT_TYPES.DOMAIN_WARNING:
      alertStyles = `
        .fnd-alert-domain {
          background-color: #FFF8E1;
          color: #F57F17;
          border-bottom: 1px solid #FFE082;
        }
      `;
      break;
      
    default: // PENDING
      alertStyles = `
        .fnd-alert-pending {
          background-color: #E3F2FD;
          color: #1565C0;
          border-bottom: 1px solid #BBDEFB;
        }
      `;
  }
  
  // Combine all HTML
  return `
    <style>
      ${baseStyles}
      ${alertStyles}
    </style>
    <div class="fnd-alert ${alertClass}">
      <div class="fnd-alert-content">
        <div class="fnd-alert-icon">
          ${iconHtml}
        </div>
        <div class="fnd-alert-text">
          <div class="fnd-alert-title">${titleText}</div>
          <div class="fnd-alert-message">${messageText}</div>
        </div>
      </div>
      <div class="fnd-alert-actions">
        ${actionButtonHtml}
        <button class="fnd-alert-close">&times;</button>
      </div>
    </div>
  `;
}

// Set up event listeners for alert
function setupAlertEventListeners() {
  // Close button
  const closeButton = alertContainer.querySelector('.fnd-alert-close');
  if (closeButton) {
    closeButton.addEventListener('click', hideAlert);
  }
  
  // Details button
  const detailsButton = alertContainer.querySelector('.fnd-alert-details');
  if (detailsButton) {
    detailsButton.addEventListener('click', showDetails);
  }
}

// Hide alert
function hideAlert() {
  if (alertContainer) {
    alertContainer.style.display = 'none';
    alertShown = false;
  }
}

// Show details about flagged content
function showDetails() {
  // Open extension popup
  chrome.runtime.sendMessage({
    action: 'openPopup'
  });
}

// Adapt to specific platforms
function adaptToPlatform() {
  const hostname = window.location.hostname;
  
  // Facebook
  if (hostname.includes('facebook.com')) {
    adaptToFacebook();
  }
  
  // Twitter/X
  else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    adaptToTwitter();
  }
  
  // Reddit
  else if (hostname.includes('reddit.com')) {
    adaptToReddit();
  }
  
  // YouTube
  else if (hostname.includes('youtube.com')) {
    adaptToYouTube();
  }
  
  // Instagram
  else if (hostname.includes('instagram.com')) {
    adaptToInstagram();
  }
  
  // TikTok
  else if (hostname.includes('tiktok.com')) {
    adaptToTikTok();
  }
  
  // LinkedIn
  else if (hostname.includes('linkedin.com')) {
    adaptToLinkedIn();
  }
  
  // For other sites, use generic adaptation
  else {
    adaptToGenericSite();
  }
}

// Platform-specific adaptations
// These functions would contain platform-specific logic to identify and
// add flagging buttons to posts, articles, etc.

function adaptToFacebook() {
  console.log('Fake News Detector: Adapting to Facebook');
  // Implementation would identify Facebook posts and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToTwitter() {
  console.log('Fake News Detector: Adapting to Twitter/X');
  // Implementation would identify tweets and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToReddit() {
  console.log('Fake News Detector: Adapting to Reddit');
  // Implementation would identify Reddit posts and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToYouTube() {
  console.log('Fake News Detector: Adapting to YouTube');
  // Implementation would identify YouTube videos and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToInstagram() {
  console.log('Fake News Detector: Adapting to Instagram');
  // Implementation would identify Instagram posts and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToTikTok() {
  console.log('Fake News Detector: Adapting to TikTok');
  // Implementation would identify TikTok videos and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToLinkedIn() {
  console.log('Fake News Detector: Adapting to LinkedIn');
  // Implementation would identify LinkedIn posts and add flagging buttons
  // This is a placeholder for the actual implementation
}

function adaptToGenericSite() {
  console.log('Fake News Detector: Adapting to generic site');
  // Implementation would add a generic flagging button
  // This is a placeholder for the actual implementation
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

