// Constants
const API_BASE_URL = 'https://5000-itrod78xwnexz2yeyodur-8e3f49e7.manusvm.computer/api'; // Backend API URL
const WEBSITE_URL = 'https://5173-itrod78xwnexz2yeyodur-8e3f49e7.manusvm.computer'; // Website URL

// DOM Elements
const connectionStatusEl = document.getElementById('connectionStatus');
const pageStatusSectionEl = document.getElementById('pageStatusSection');
const pageStatusCardEl = document.getElementById('pageStatusCard');
const flagFormEl = document.getElementById('flagForm');
const flagReasonEl = document.getElementById('flagReason');
const flagDetailsEl = document.getElementById('flagDetails');
const includeScreenshotEl = document.getElementById('includeScreenshot');
const submitFlagBtnEl = document.getElementById('submitFlagBtn');
const settingsBtnEl = document.getElementById('settingsBtn');
const websiteLinkEl = document.getElementById('websiteLink');
const userStatusEl = document.getElementById('userStatus');
const loginBtnEl = document.getElementById('loginBtn');
const notificationToastEl = document.getElementById('notificationToast');
const toastMessageEl = notificationToastEl.querySelector('.toast-message');
const toastCloseEl = notificationToastEl.querySelector('.toast-close');

// State
let currentUrl = '';
let currentTabId = null;
let currentPageTitle = '';
let isConnected = false;
let userInfo = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Set website link
    websiteLinkEl.href = WEBSITE_URL;
    
    // Get current tab info
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) {
      showError('Could not get current tab information');
      return;
    }
    
    const currentTab = tabs[0];
    currentTabId = currentTab.id;
    currentUrl = currentTab.url;
    currentPageTitle = currentTab.title || '';
    
    // Check if URL is valid for flagging
    if (!isValidUrl(currentUrl)) {
      updatePageStatus({
        status: 'invalid',
        message: 'This page cannot be flagged',
        details: 'Only web pages with http:// or https:// URLs can be flagged.'
      });
      disableFlagging();
      return;
    }
    
    // Check connection status
    await checkConnectionStatus();
    
    // Check if current page is flagged
    await checkCurrentPageStatus();
    
    // Check user login status
    await checkUserStatus();
    
    // Set up event listeners
    setupEventListeners();
    
  } catch (error) {
    console.error('Error initializing popup:', error);
    showError('Failed to initialize. Please try again.');
  }
});

// Check connection to backend API
async function checkConnectionStatus() {
  try {
    // In a real implementation, this would make an API call to check status
    // For now, we'll simulate a successful connection
    setTimeout(() => {
      isConnected = true;
      updateConnectionStatus(true);
    }, 500);
  } catch (error) {
    console.error('Error checking connection:', error);
    updateConnectionStatus(false);
  }
}

// Update connection status UI
function updateConnectionStatus(connected) {
  const statusDot = connectionStatusEl.querySelector('.status-dot');
  const statusText = connectionStatusEl.querySelector('.status-text');
  
  if (connected) {
    statusDot.classList.add('connected');
    statusText.textContent = 'Connected';
  } else {
    statusDot.classList.add('error');
    statusText.textContent = 'Disconnected';
  }
}

// Check if current page has been flagged
async function checkCurrentPageStatus() {
  try {
    // Show loading state
    pageStatusCardEl.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Checking current page...</p>
    `;
    
    // Send message to background script to check URL status
    const response = await chrome.runtime.sendMessage({
      action: 'checkUrl',
      url: currentUrl
    });
    
    // Update UI based on response
    if (response && response.success) {
      updatePageStatus(response.data);
    } else {
      throw new Error('Failed to check URL status');
    }
  } catch (error) {
    console.error('Error checking page status:', error);
    updatePageStatus({
      status: 'error',
      message: 'Could not check status',
      details: 'There was an error checking this page. Please try again.'
    });
  }
}

// Update page status UI
function updatePageStatus(data) {
  let statusHtml = '';
  
  switch (data.status) {
    case 'flagged':
      const verificationScore = data.verificationScore || 0;
      const scoreWidth = `${verificationScore}%`;
      const scoreColor = getScoreColor(verificationScore);
      
      statusHtml = `
        <div class="status-icon">⚠️</div>
        <h3 class="status-title">This content has been flagged</h3>
        <p class="status-description">${data.message || 'This content has been reported as potentially misleading.'}</p>
        <div class="verification-score">
          <div class="verification-score-bar" style="width: ${scoreWidth}; background-color: ${scoreColor};"></div>
        </div>
        <p class="status-description" style="margin-top: 8px;">
          Flagged ${data.flagCount || 'multiple'} times | 
          ${data.verificationStatus || 'Under review'}
        </p>
      `;
      pageStatusCardEl.className = 'status-card flagged';
      break;
      
    case 'safe':
      statusHtml = `
        <div class="status-icon">✅</div>
        <h3 class="status-title">No flags detected</h3>
        <p class="status-description">This content has not been flagged by our community.</p>
      `;
      pageStatusCardEl.className = 'status-card safe';
      break;
      
    case 'invalid':
      statusHtml = `
        <div class="status-icon">ℹ️</div>
        <h3 class="status-title">${data.message || 'Cannot check this page'}</h3>
        <p class="status-description">${data.details || 'This type of page cannot be checked.'}</p>
      `;
      pageStatusCardEl.className = 'status-card unknown';
      break;
      
    case 'error':
      statusHtml = `
        <div class="status-icon">❌</div>
        <h3 class="status-title">${data.message || 'Error checking status'}</h3>
        <p class="status-description">${data.details || 'There was an error checking this page.'}</p>
      `;
      pageStatusCardEl.className = 'status-card unknown';
      break;
      
    default:
      statusHtml = `
        <div class="status-icon">❓</div>
        <h3 class="status-title">Status unknown</h3>
        <p class="status-description">We couldn't determine the status of this content.</p>
      `;
      pageStatusCardEl.className = 'status-card unknown';
  }
  
  pageStatusCardEl.innerHTML = statusHtml;
}

// Get color based on verification score
function getScoreColor(score) {
  if (score >= 80) return '#EA4335'; // High risk - red
  if (score >= 60) return '#FBBC05'; // Medium risk - yellow
  return '#34A853'; // Low risk - green
}

// Check user login status
async function checkUserStatus() {
  try {
    // Send message to background script to get user info
    const response = await chrome.runtime.sendMessage({
      action: 'getUserInfo'
    });
    
    if (response && response.success && response.data.user) {
      userInfo = response.data.user;
      updateUserStatusUI(true);
    } else {
      updateUserStatusUI(false);
    }
  } catch (error) {
    console.error('Error checking user status:', error);
    updateUserStatusUI(false);
  }
}

// Update user status UI
function updateUserStatusUI(isLoggedIn) {
  if (isLoggedIn && userInfo) {
    userStatusEl.innerHTML = `
      <span>${userInfo.displayName || userInfo.username}</span>
      <button id="logoutBtn" class="text-button">Logout</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  } else {
    userStatusEl.innerHTML = `
      <span>Not logged in</span>
      <button id="loginBtn" class="text-button">Login</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Flag form submission
  flagFormEl.addEventListener('submit', handleFlagSubmit);
  
  // Settings button
  settingsBtnEl.addEventListener('click', handleSettingsClick);
  
  // Toast close button
  toastCloseEl.addEventListener('click', hideToast);
}

// Handle flag form submission
async function handleFlagSubmit(event) {
  event.preventDefault();
  
  if (!isConnected) {
    showToast('Not connected to server. Please try again later.');
    return;
  }
  
  const reason = flagReasonEl.value;
  if (!reason) {
    showToast('Please select a reason for flagging.');
    return;
  }
  
  // Show loading state
  const buttonText = submitFlagBtnEl.querySelector('.button-text');
  const buttonSpinner = submitFlagBtnEl.querySelector('.button-spinner');
  buttonText.textContent = 'Submitting...';
  buttonSpinner.classList.remove('hidden');
  submitFlagBtnEl.disabled = true;
  
  try {
    // Capture screenshot if requested
    let screenshot = null;
    if (includeScreenshotEl.checked) {
      screenshot = await captureScreenshot();
    }
    
    // Prepare flag data
    const flagData = {
      url: currentUrl,
      title: currentPageTitle,
      reason: reason,
      details: flagDetailsEl.value,
      screenshot: screenshot,
      source: 'extension'
    };
    
    // Send message to background script to submit flag
    const response = await chrome.runtime.sendMessage({
      action: 'submitFlag',
      data: flagData
    });
    
    // Handle response
    if (response && response.success) {
      showToast('Content flagged successfully!');
      flagFormEl.reset();
      
      // Refresh page status after flagging
      setTimeout(() => {
        checkCurrentPageStatus();
      }, 1000);
    } else {
      throw new Error(response.message || 'Failed to submit flag');
    }
  } catch (error) {
    console.error('Error submitting flag:', error);
    showToast('Error submitting flag. Please try again.');
  } finally {
    // Reset button state
    buttonText.textContent = 'Submit Flag';
    buttonSpinner.classList.add('hidden');
    submitFlagBtnEl.disabled = false;
  }
}

// Capture screenshot of current tab
async function captureScreenshot() {
  try {
    const screenshotUrl = await chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 70 });
    return screenshotUrl.split(',')[1]; // Remove data URL prefix
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

// Handle settings button click
function handleSettingsClick() {
  chrome.runtime.openOptionsPage();
}

// Handle login button click
function handleLogin() {
  // Open login page in new tab
  chrome.tabs.create({ url: `${WEBSITE_URL}/login?source=extension` });
}

// Handle logout button click
async function handleLogout() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'logout'
    });
    
    if (response && response.success) {
      userInfo = null;
      updateUserStatusUI(false);
      showToast('Logged out successfully');
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Error logging out:', error);
    showToast('Error logging out. Please try again.');
  }
}

// Show toast notification
function showToast(message, duration = 3000) {
  toastMessageEl.textContent = message;
  notificationToastEl.classList.remove('hidden');
  
  // Auto-hide after duration
  setTimeout(() => {
    hideToast();
  }, duration);
}

// Hide toast notification
function hideToast() {
  notificationToastEl.classList.add('hidden');
}

// Show error in page status
function showError(message) {
  updatePageStatus({
    status: 'error',
    message: 'Error',
    details: message
  });
}

// Disable flagging functionality
function disableFlagging() {
  flagFormEl.querySelectorAll('input, select, textarea, button').forEach(el => {
    el.disabled = true;
  });
}

// Check if URL is valid for flagging
function isValidUrl(url) {
  if (!url) return false;
  
  // Check if URL starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  // Exclude browser internal pages
  const invalidPrefixes = [
    'chrome://', 
    'chrome-extension://', 
    'edge://', 
    'about:', 
    'file:'
  ];
  
  for (const prefix of invalidPrefixes) {
    if (url.startsWith(prefix)) {
      return false;
    }
  }
  
  return true;
}

