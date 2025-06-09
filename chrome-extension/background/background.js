// Constants
const API_BASE_URL = 'https://5000-itrod78xwnexz2yeyodur-8e3f49e7.manusvm.computer/api'; // Backend API URL
const SYNC_INTERVAL_MINUTES = 30; // How often to sync with the backend
const ALARM_NAME = 'syncAlarm';
const DEFAULT_SETTINGS = {
  alertLevel: 'all', // 'all', 'verified_only', 'high_score_only', 'none'
  autoSync: true,
  syncInterval: SYNC_INTERVAL_MINUTES
};

// State
let flaggedUrls = new Map(); // Map of flagged URLs with their status
let flaggedDomains = new Map(); // Map of domains with flag counts
let userToken = null; // JWT token for authenticated requests
let extensionId = null; // Unique ID for this extension instance
let lastSyncTime = null; // Timestamp of last sync

// Initialize extension
async function initialize() {
  console.log('Fake News Detector: Initializing background service worker');
  
  try {
    // Load stored data
    await loadStoredData();
    
    // Generate or retrieve extension ID
    await ensureExtensionId();
    
    // Set up context menu
    createContextMenu();
    
    // Set up alarm for periodic sync
    setupSyncAlarm();
    
    // Perform initial sync
    await syncWithBackend();
    
    console.log('Fake News Detector: Initialization complete');
  } catch (error) {
    console.error('Fake News Detector: Initialization error', error);
  }
}

// Load data from storage
async function loadStoredData() {
  const data = await chrome.storage.local.get([
    'flaggedUrls',
    'flaggedDomains',
    'userToken',
    'extensionId',
    'lastSyncTime',
    'settings'
  ]);
  
  // Parse flagged URLs
  if (data.flaggedUrls) {
    try {
      flaggedUrls = new Map(JSON.parse(data.flaggedUrls));
    } catch (e) {
      console.error('Error parsing flaggedUrls', e);
      flaggedUrls = new Map();
    }
  }
  
  // Parse flagged domains
  if (data.flaggedDomains) {
    try {
      flaggedDomains = new Map(JSON.parse(data.flaggedDomains));
    } catch (e) {
      console.error('Error parsing flaggedDomains', e);
      flaggedDomains = new Map();
    }
  }
  
  // Set user token if available
  userToken = data.userToken || null;
  
  // Set extension ID if available
  extensionId = data.extensionId || null;
  
  // Set last sync time if available
  lastSyncTime = data.lastSyncTime || null;
  
  // Load settings or use defaults
  settings = data.settings || DEFAULT_SETTINGS;
  
  console.log('Fake News Detector: Loaded stored data');
}

// Ensure extension has a unique ID
async function ensureExtensionId() {
  if (!extensionId) {
    // Generate a random ID
    extensionId = 'ext_' + Math.random().toString(36).substring(2, 15);
    
    // Store it
    await chrome.storage.local.set({ extensionId });
    console.log('Fake News Detector: Generated new extension ID', extensionId);
  }
}

// Create context menu items
function createContextMenu() {
  chrome.contextMenus.removeAll();
  
  chrome.contextMenus.create({
    id: 'flagContent',
    title: 'Flag as Fake News',
    contexts: ['page', 'link', 'selection', 'image']
  });
  
  console.log('Fake News Detector: Created context menu');
}

// Set up alarm for periodic sync
function setupSyncAlarm() {
  // Clear any existing alarms
  chrome.alarms.clear(ALARM_NAME);
  
  // Create new alarm if auto-sync is enabled
  if (settings.autoSync) {
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: settings.syncInterval
    });
    console.log(`Fake News Detector: Set up sync alarm every ${settings.syncInterval} minutes`);
  }
}

// Sync data with backend
async function syncWithBackend() {
  console.log('Fake News Detector: Starting sync with backend');
  
  try {
    // Prepare request data
    const requestData = {
      extensionId: extensionId,
      lastSyncTime: lastSyncTime,
      settings: {
        alertLevel: settings.alertLevel,
        autoSync: settings.autoSync,
        syncInterval: settings.syncInterval
      }
    };
    
    // Add authentication if available
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    // Make API call to backend
    const response = await makeApiCall('/extension/sync', 'POST', requestData, headers);
    
    if (response.success) {
      // Update flagged URLs
      if (response.data.flaggedUrls && Array.isArray(response.data.flaggedUrls)) {
        for (const item of response.data.flaggedUrls) {
          flaggedUrls.set(item.url, {
            contentId: item.contentId,
            verificationStatus: item.verificationStatus,
            verificationScore: item.verificationScore
          });
        }
      }
      
      // Update flagged domains
      if (response.data.flaggedDomains && Array.isArray(response.data.flaggedDomains)) {
        for (const item of response.data.flaggedDomains) {
          flaggedDomains.set(item.domain, {
            flagCount: item.flagCount,
            verifiedFakeCount: item.verifiedFakeCount
          });
        }
      }
      
      // Update settings if provided
      if (response.data.settings) {
        settings = {
          ...settings,
          ...response.data.settings
        };
      }
      
      // Update last sync time
      lastSyncTime = new Date().toISOString();
      
      // Save updated data to storage
      await saveDataToStorage();
      
      console.log('Fake News Detector: Sync completed successfully');
      return true;
    } else {
      throw new Error(mockResponse.message || 'Sync failed');
    }
  } catch (error) {
    console.error('Fake News Detector: Sync error', error);
    return false;
  }
}

// Save data to storage
async function saveDataToStorage() {
  try {
    await chrome.storage.local.set({
      flaggedUrls: JSON.stringify(Array.from(flaggedUrls.entries())),
      flaggedDomains: JSON.stringify(Array.from(flaggedDomains.entries())),
      userToken,
      lastSyncTime,
      settings
    });
    console.log('Fake News Detector: Saved data to storage');
  } catch (error) {
    console.error('Fake News Detector: Error saving data to storage', error);
  }
}

// Check if a URL is flagged
async function checkUrl(url) {
  try {
    // First check local cache
    if (flaggedUrls.has(url)) {
      const data = flaggedUrls.get(url);
      return {
        status: 'flagged',
        message: 'This content has been flagged by our community',
        contentId: data.contentId,
        verificationStatus: data.verificationStatus,
        verificationScore: data.verificationScore
      };
    }
    
    // Check domain in local cache
    const domain = extractDomain(url);
    if (flaggedDomains.has(domain)) {
      const data = flaggedDomains.get(domain);
      return {
        status: 'flagged',
        message: 'This domain has been flagged multiple times',
        domain: domain,
        flagCount: data.flagCount,
        verifiedFakeCount: data.verifiedFakeCount
      };
    }
    
    // If not in local cache, check with backend API
    const response = await makeApiCall(`/check-url?url=${encodeURIComponent(url)}`, 'GET', null, {
      'Content-Type': 'application/json'
    });
    
    if (response.success && response.data.flagged) {
      // Add to local cache
      const content = response.data.content;
      flaggedUrls.set(url, {
        contentId: content.id,
        verificationStatus: content.verification_status,
        verificationScore: content.flag_count > 0 ? 50 : 0 // Simple score based on flag count
      });
      
      // Save to storage
      await saveDataToStorage();
      
      return {
        status: 'flagged',
        message: 'This content has been flagged by our community',
        contentId: content.id,
        verificationStatus: content.verification_status,
        verificationScore: content.flag_count > 0 ? 50 : 0,
        flagCount: content.flag_count
      };
    }
    
    // Not flagged
    return {
      status: 'safe',
      message: 'No flags detected for this content'
    };
  } catch (error) {
    console.error('Error checking URL:', error);
    
    // Fall back to local check only
    if (flaggedUrls.has(url)) {
      const data = flaggedUrls.get(url);
      return {
        status: 'flagged',
        message: 'This content has been flagged by our community',
        contentId: data.contentId,
        verificationStatus: data.verificationStatus,
        verificationScore: data.verificationScore
      };
    }
    
    // Check domain in local cache
    const domain = extractDomain(url);
    if (flaggedDomains.has(domain)) {
      const data = flaggedDomains.get(domain);
      return {
        status: 'flagged',
        message: 'This domain has been flagged multiple times',
        domain: domain,
        flagCount: data.flagCount,
        verifiedFakeCount: data.verifiedFakeCount
      };
    }
    
    // Not flagged
    return {
      status: 'safe',
      message: 'No flags detected for this content'
    };
  }
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    console.error('Error extracting domain', e);
    return '';
  }
}

// Submit a flag
async function submitFlag(flagData) {
  console.log('Fake News Detector: Submitting flag', flagData);
  
  try {
    // Add extension ID
    flagData.extensionId = extensionId;
    
    // Add authentication if available
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    // Make API call to backend
    const response = await makeApiCall('/flagged-content', 'POST', flagData, headers);
    
    if (response.success) {
      // Update local data
      const url = flagData.url;
      const domain = extractDomain(url);
      
      // Add to flagged URLs
      flaggedUrls.set(url, {
        contentId: response.data.content.id,
        verificationStatus: 'pending',
        verificationScore: 0
      });
      
      // Update domain count
      if (flaggedDomains.has(domain)) {
        const domainData = flaggedDomains.get(domain);
        domainData.flagCount++;
        flaggedDomains.set(domain, domainData);
      } else {
        flaggedDomains.set(domain, {
          flagCount: 1,
          verifiedFakeCount: 0
        });
      }
      
      // Save updated data
      await saveDataToStorage();
      
      console.log('Fake News Detector: Flag submitted successfully');
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error(response.message || 'Flag submission failed');
    }
  } catch (error) {
    console.error('Fake News Detector: Flag submission error', error);
    return {
      success: false,
      message: error.message || 'An error occurred while submitting the flag'
    };
  }
}

// Get user information
function getUserInfo() {
  // If we have a token, the user is logged in
  if (userToken) {
    // In a real implementation, this would decode the JWT or make an API call
    // For now, we'll return mock user data
    return {
      success: true,
      data: {
        user: {
          id: 'user123',
          username: 'testuser',
          displayName: 'Test User',
          email: 'test@example.com'
        }
      }
    };
  } else {
    return {
      success: false,
      data: {
        user: null
      }
    };
  }
}

// Handle logout
async function handleLogout() {
  // Clear user token
  userToken = null;
  
  // Save to storage
  await chrome.storage.local.set({ userToken: null });
  
  return {
    success: true,
    message: 'Logged out successfully'
  };
}

// Check if content should trigger an alert based on settings
function shouldShowAlert(flagData) {
  // If alerts are disabled, never show
  if (settings.alertLevel === 'none') {
    return false;
  }
  
  // For 'all' level, show any flagged content
  if (settings.alertLevel === 'all') {
    return true;
  }
  
  // For 'verified_only', only show verified fake/misleading content
  if (settings.alertLevel === 'verified_only') {
    return flagData.verificationStatus === 'verified_fake' || 
           flagData.verificationStatus === 'verified_misleading';
  }
  
  // For 'high_score_only', only show content with high verification score
  if (settings.alertLevel === 'high_score_only') {
    return flagData.verificationScore >= 70;
  }
  
  return false;
}

// Show alert for flagged content
async function showAlertForTab(tabId, flagData) {
  try {
    // Check if we should show an alert based on settings
    if (!shouldShowAlert(flagData)) {
      return;
    }
    
    // Send message to content script to show alert
    await chrome.tabs.sendMessage(tabId, {
      action: 'showAlert',
      data: flagData
    });
    
    console.log('Fake News Detector: Sent alert to tab', tabId);
  } catch (error) {
    console.error('Fake News Detector: Error showing alert', error);
    
    // Content script might not be loaded yet, inject it
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content.js']
      });
      
      // Try sending the message again
      await chrome.tabs.sendMessage(tabId, {
        action: 'showAlert',
        data: flagData
      });
    } catch (injectError) {
      console.error('Fake News Detector: Error injecting content script', injectError);
    }
  }
}

// Make API call to backend
async function makeApiCall(endpoint, method, data, headers) {
  console.log(`Fake News Detector: Making API call to ${endpoint}`, { method, data, headers });
  
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
      method: method,
      headers: headers || {
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    };
    
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data: responseData,
        message: responseData.message || 'Request successful'
      };
    } else {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }
  } catch (error) {
    console.error('API call error:', error);
    
    // Fall back to simulated response for development
    return simulateApiCall(endpoint, method, data, headers);
  }
}

// Event Listeners

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Fake News Detector: Received message', message);
  
  // Handle different message actions
  switch (message.action) {
    case 'checkUrl':
      // We need to handle this asynchronously
      checkUrl(message.url)
        .then(result => sendResponse({
          success: true,
          data: result
        }))
        .catch(error => {
          sendResponse({
            success: false,
            message: error.message || 'An error occurred'
          });
        });
      return true; // Indicates we'll respond asynchronously
      
    case 'submitFlag':
      // We need to handle this asynchronously
      submitFlag(message.data)
        .then(response => sendResponse(response))
        .catch(error => {
          sendResponse({
            success: false,
            message: error.message || 'An error occurred'
          });
        });
      return true; // Indicates we'll respond asynchronously
      
    case 'getUserInfo':
      sendResponse(getUserInfo());
      break;
      
    case 'logout':
      handleLogout()
        .then(response => sendResponse(response))
        .catch(error => {
          sendResponse({
            success: false,
            message: error.message || 'An error occurred'
          });
        });
      return true; // Indicates we'll respond asynchronously
      
    default:
      sendResponse({
        success: false,
        message: 'Unknown action'
      });
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only check when the tab has finished loading
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Fake News Detector: Tab updated', tabId, tab.url);
    
    // Check if the URL is flagged
    checkUrl(tab.url)
      .then(flagData => {
        // If flagged, show alert
        if (flagData.status === 'flagged') {
          showAlertForTab(tabId, flagData);
        }
      })
      .catch(error => {
        console.error('Error checking URL for tab update:', error);
      });
  }
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'flagContent') {
    console.log('Fake News Detector: Context menu clicked', info, tab);
    
    // Open popup for flagging
    chrome.action.openPopup();
  }
});

// Listen for alarm (periodic sync)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('Fake News Detector: Sync alarm triggered');
    syncWithBackend();
  }
});

// Initialize on install or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Fake News Detector: Extension installed or updated', details.reason);
  initialize();
});

// Initialize when service worker starts
initialize();


// Simulate API call (for development and fallback when backend is unavailable)
async function simulateApiCall(endpoint, method, data, headers) {
  return new Promise((resolve) => {
    console.log(`Fake News Detector: Simulating API call to ${endpoint}`, { method, data, headers });
    
    // Simulate network delay
    setTimeout(() => {
      // Simulate different endpoints
      switch (endpoint) {
        case '/extension/sync':
          resolve({
            success: true,
            data: {
              syncTime: new Date().toISOString(),
              flaggedDomains: [
                {
                  domain: 'fakenews-example.com',
                  flagCount: 42,
                  verifiedFakeCount: 28
                },
                {
                  domain: 'misleading-site.org',
                  flagCount: 17,
                  verifiedFakeCount: 10
                }
              ],
              flaggedUrls: [
                {
                  url: 'https://fakenews-example.com/article1',
                  contentId: 'content123',
                  verificationStatus: 'verified_fake',
                  verificationScore: 85
                },
                {
                  url: 'https://misleading-site.org/story',
                  contentId: 'content456',
                  verificationStatus: 'verified_misleading',
                  verificationScore: 65
                }
              ],
              settings: {
                alertLevel: 'verified_only',
                autoSync: true,
                syncInterval: 30
              }
            },
            message: 'Extension data synchronized successfully'
          });
          break;
          
        case '/extension/flag':
          resolve({
            success: true,
            data: {
              content: {
                id: 'content' + Math.floor(Math.random() * 1000),
                url: data.url,
                verifiedStatus: 'pending',
                flagCount: 1
              },
              flag: {
                id: 'flag' + Math.floor(Math.random() * 1000),
                status: 'pending'
              }
            },
            message: 'Content flagged successfully'
          });
          break;
          
        default:
          resolve({
            success: false,
            message: 'Unknown endpoint'
          });
      }
    }, 500);
  });
}

