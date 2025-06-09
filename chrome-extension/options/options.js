// Constants
const API_BASE_URL = 'https://api.fakenewsdetection.example.com/v1'; // Will be replaced with actual API URL
const WEBSITE_URL = 'https://fakenewsdetection.example.com'; // Will be replaced with actual website URL
const DEFAULT_SETTINGS = {
  alertLevel: 'all',
  autoSync: true,
  syncInterval: 30
};

// DOM Elements
const alertLevelEl = document.getElementById('alertLevel');
const autoSyncEl = document.getElementById('autoSync');
const syncIntervalEl = document.getElementById('syncInterval');
const syncNowBtnEl = document.getElementById('syncNowBtn');
const lastSyncTimeEl = document.getElementById('lastSyncTime');
const accountSectionEl = document.getElementById('accountSection');
const websiteLinkEl = document.getElementById('websiteLink');
const privacyLinkEl = document.getElementById('privacyLink');
const termsLinkEl = document.getElementById('termsLink');
const resetBtnEl = document.getElementById('resetBtn');
const saveBtnEl = document.getElementById('saveBtn');
const saveStatusEl = document.getElementById('saveStatus');

// State
let settings = { ...DEFAULT_SETTINGS };
let userInfo = null;
let lastSyncTime = null;
let hasChanges = false;

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Set website links
    websiteLinkEl.href = WEBSITE_URL;
    privacyLinkEl.href = `${WEBSITE_URL}/privacy`;
    termsLinkEl.href = `${WEBSITE_URL}/terms`;
    
    // Load settings
    await loadSettings();
    
    // Load user info
    await loadUserInfo();
    
    // Set up event listeners
    setupEventListeners();
    
  } catch (error) {
    console.error('Error initializing options page:', error);
    showSaveStatus('Error loading settings. Please try again.', false);
  }
});

// Load settings from storage
async function loadSettings() {
  try {
    const data = await chrome.storage.local.get(['settings', 'lastSyncTime']);
    
    if (data.settings) {
      settings = { ...DEFAULT_SETTINGS, ...data.settings };
    }
    
    lastSyncTime = data.lastSyncTime;
    
    // Update UI with loaded settings
    updateSettingsUI();
    
  } catch (error) {
    console.error('Error loading settings:', error);
    throw error;
  }
}

// Update UI with current settings
function updateSettingsUI() {
  // Alert level
  alertLevelEl.value = settings.alertLevel;
  
  // Auto sync
  autoSyncEl.checked = settings.autoSync;
  
  // Sync interval
  syncIntervalEl.value = settings.syncInterval;
  syncIntervalEl.disabled = !settings.autoSync;
  
  // Last sync time
  if (lastSyncTime) {
    const date = new Date(lastSyncTime);
    lastSyncTimeEl.textContent = date.toLocaleString();
  } else {
    lastSyncTimeEl.textContent = 'Never';
  }
  
  // Reset change tracking
  hasChanges = false;
}

// Load user information
async function loadUserInfo() {
  try {
    // Send message to background script to get user info
    const response = await chrome.runtime.sendMessage({
      action: 'getUserInfo'
    });
    
    if (response && response.success && response.data.user) {
      userInfo = response.data.user;
      updateAccountUI(true);
    } else {
      updateAccountUI(false);
    }
  } catch (error) {
    console.error('Error loading user info:', error);
    updateAccountUI(false);
  }
}

// Update account section UI
function updateAccountUI(isLoggedIn) {
  if (isLoggedIn && userInfo) {
    // Get first letter of display name or username for avatar
    const firstLetter = (userInfo.displayName || userInfo.username || 'U').charAt(0).toUpperCase();
    
    accountSectionEl.innerHTML = `
      <div class="account-info">
        <div class="account-avatar">${firstLetter}</div>
        <div class="account-details">
          <div class="account-name">${userInfo.displayName || userInfo.username}</div>
          <div class="account-email">${userInfo.email}</div>
        </div>
      </div>
      <div class="account-actions">
        <button id="logoutBtn" class="secondary-button">Logout</button>
      </div>
    `;
    
    // Add logout button event listener
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  } else {
    accountSectionEl.innerHTML = `
      <div class="account-login">
        <p>You are not logged in. Login to sync your flags across devices and participate in moderation.</p>
        <button id="loginBtn" class="primary-button">Login / Register</button>
      </div>
    `;
    
    // Add login button event listener
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Alert level change
  alertLevelEl.addEventListener('change', () => {
    settings.alertLevel = alertLevelEl.value;
    hasChanges = true;
  });
  
  // Auto sync change
  autoSyncEl.addEventListener('change', () => {
    settings.autoSync = autoSyncEl.checked;
    syncIntervalEl.disabled = !settings.autoSync;
    hasChanges = true;
  });
  
  // Sync interval change
  syncIntervalEl.addEventListener('change', () => {
    const value = parseInt(syncIntervalEl.value, 10);
    if (value >= 15) {
      settings.syncInterval = value;
      hasChanges = true;
    } else {
      syncIntervalEl.value = 15;
      settings.syncInterval = 15;
      hasChanges = true;
    }
  });
  
  // Sync now button
  syncNowBtnEl.addEventListener('click', handleSyncNow);
  
  // Reset button
  resetBtnEl.addEventListener('click', handleReset);
  
  // Save button
  saveBtnEl.addEventListener('click', handleSave);
}

// Handle sync now button click
async function handleSyncNow() {
  try {
    syncNowBtnEl.disabled = true;
    syncNowBtnEl.textContent = 'Syncing...';
    
    // Send message to background script to sync
    const response = await chrome.runtime.sendMessage({
      action: 'syncNow'
    });
    
    if (response && response.success) {
      // Update last sync time
      lastSyncTime = new Date().toISOString();
      lastSyncTimeEl.textContent = new Date(lastSyncTime).toLocaleString();
      
      showSaveStatus('Sync completed successfully!', true);
    } else {
      throw new Error(response.message || 'Sync failed');
    }
  } catch (error) {
    console.error('Error syncing:', error);
    showSaveStatus('Error syncing. Please try again.', false);
  } finally {
    syncNowBtnEl.disabled = false;
    syncNowBtnEl.textContent = 'Sync Now';
  }
}

// Handle reset button click
function handleReset() {
  // Reset settings to defaults
  settings = { ...DEFAULT_SETTINGS };
  
  // Update UI
  updateSettingsUI();
  
  showSaveStatus('Settings reset to defaults. Click Save to apply.', true);
  hasChanges = true;
}

// Handle save button click
async function handleSave() {
  try {
    if (!hasChanges) {
      showSaveStatus('No changes to save.', true);
      return;
    }
    
    saveBtnEl.disabled = true;
    saveBtnEl.textContent = 'Saving...';
    
    // Save settings to storage
    await chrome.storage.local.set({ settings });
    
    // Send message to background script to update settings
    await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings
    });
    
    showSaveStatus('Settings saved successfully!', true);
    hasChanges = false;
  } catch (error) {
    console.error('Error saving settings:', error);
    showSaveStatus('Error saving settings. Please try again.', false);
  } finally {
    saveBtnEl.disabled = false;
    saveBtnEl.textContent = 'Save Changes';
  }
}

// Handle login button click
function handleLogin() {
  // Open login page in new tab
  chrome.tabs.create({ url: `${WEBSITE_URL}/login?source=extension_options` });
}

// Handle logout button click
async function handleLogout() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'logout'
    });
    
    if (response && response.success) {
      userInfo = null;
      updateAccountUI(false);
      showSaveStatus('Logged out successfully', true);
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Error logging out:', error);
    showSaveStatus('Error logging out. Please try again.', false);
  }
}

// Show save status message
function showSaveStatus(message, isSuccess) {
  saveStatusEl.textContent = message;
  saveStatusEl.className = 'save-status ' + (isSuccess ? 'success' : 'error');
  
  // Clear message after a delay
  setTimeout(() => {
    saveStatusEl.textContent = '';
    saveStatusEl.className = 'save-status';
  }, 3000);
}

