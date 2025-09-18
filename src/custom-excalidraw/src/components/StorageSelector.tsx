import { useState, useEffect } from 'react';
import { StorageManager } from '../storage/StorageManager';
import type { StorageProviderType } from '../storage/types';

interface StorageSelectorProps {
  onProviderChange?: (provider: StorageProviderType) => void;
}

export function StorageSelector({ onProviderChange }: StorageSelectorProps) {
  const [currentProvider, setCurrentProvider] = useState<StorageProviderType>('local');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [googleConfig, setGoogleConfig] = useState({
    clientId: '',
    apiKey: ''
  });
  const [isMigrating, setIsMigrating] = useState(false);

  const storageManager = StorageManager.getInstance();

  useEffect(() => {
    const loadCurrentState = async () => {
      const provider = storageManager.getCurrentProviderType();
      setCurrentProvider(provider);
      
      const config = storageManager.getConfig();
      if (config.googleDrive) {
        setGoogleConfig(config.googleDrive);
      }

      if (provider === 'googledrive') {
        const authenticated = await storageManager.getProvider().isAuthenticated();
        setIsAuthenticated(authenticated);
      }
    };

    loadCurrentState();
  }, []);

  const handleProviderChange = async (provider: StorageProviderType, migrate: boolean = false) => {
    try {
      if (migrate) {
        setIsMigrating(true);
      }

      // For Google Drive, ensure authentication first
      if (provider === 'googledrive') {
        const tempProvider = storageManager.createProviderInstance('googledrive');
        await tempProvider.initialize();
        const authenticated = await tempProvider.isAuthenticated();
        if (!authenticated) {
          alert('Please authenticate with Google Drive first by clicking "Connect to Google Drive".');
          return;
        }
      }

      await storageManager.switchProvider(provider, migrate);
      setCurrentProvider(provider);
      
      if (provider === 'googledrive') {
        const authenticated = await storageManager.getProvider().isAuthenticated();
        setIsAuthenticated(authenticated);
      } else {
        setIsAuthenticated(false);
      }

      onProviderChange?.(provider);
    } catch (error) {
      console.error('Failed to switch provider:', error);
      alert(`Failed to switch storage provider: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleAuthenticate = async () => {
    try {
      setIsAuthenticating(true);
      await storageManager.getProvider().authenticate();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await storageManager.getProvider().disconnect();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
      alert(`Disconnect failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleConfigSave = async () => {
    try {
      await storageManager.updateGoogleDriveConfig(googleConfig.clientId, googleConfig.apiKey);
      setShowConfig(false);
      alert('Google Drive configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save config:', error);
      alert(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getProviderStatus = () => {
    if (currentProvider === 'local') {
      return '✅ Ready';
    }
    
    if (currentProvider === 'googledrive') {
      if (isAuthenticated) {
        return '✅ Connected';
      } else {
        return '❌ Not authenticated';
      }
    }
    
    return '❓ Unknown';
  };

  return (
    <div className="storage-selector">
      <div className="storage-header">
        <h3>Storage Provider</h3>
        <div className="storage-status">
          <span className="provider-name">{storageManager.getProvider().getProviderName()}</span>
          <span className="provider-status">{getProviderStatus()}</span>
        </div>
      </div>

      <div className="storage-options">
        <div className="storage-option">
          <label>
            <input
              type="radio"
              name="storage-provider"
              value="local"
              checked={currentProvider === 'local'}
              onChange={() => handleProviderChange('local')}
              disabled={isMigrating}
            />
            <div className="option-content">
              <strong>Local Storage</strong>
              <span>Store drawings locally in your browser</span>
            </div>
          </label>
        </div>

        <div className="storage-option">
          <label>
            <input
              type="radio"
              name="storage-provider"
              value="googledrive"
              checked={currentProvider === 'googledrive'}
              onChange={() => handleProviderChange('googledrive')}
              disabled={isMigrating}
            />
            <div className="option-content">
              <strong>Google Drive</strong>
              <span>Sync drawings to your Google Drive</span>
            </div>
          </label>
          
          {currentProvider === 'googledrive' && (
            <div className="google-drive-controls">
              {!isAuthenticated ? (
                <div className="auth-controls">
                  <button 
                    onClick={handleAuthenticate}
                    disabled={isAuthenticating}
                    className="auth-button"
                  >
                    {isAuthenticating ? 'Connecting...' : 'Connect to Google Drive'}
                  </button>
                  <button 
                    onClick={() => setShowConfig(true)}
                    className="config-button"
                  >
                    Configure API Keys
                  </button>
                </div>
              ) : (
                <div className="connected-controls">
                  <span className="connected-status">✅ Connected to Google Drive</span>
                  <button 
                    onClick={handleDisconnect}
                    className="disconnect-button"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {(currentProvider === 'googledrive' || currentProvider === 'local') && (
        <div className="migration-section">
          <h4>Data Migration</h4>
          <p>Switch providers and migrate your existing drawings:</p>
          <div className="migration-buttons">
            <button
              onClick={() => handleProviderChange('local', true)}
              disabled={isMigrating || currentProvider === 'local'}
              className="migrate-button"
            >
              {isMigrating ? 'Migrating...' : 'Migrate to Local Storage'}
            </button>
            <button
              onClick={() => handleProviderChange('googledrive', true)}
              disabled={isMigrating || currentProvider === 'googledrive'}
              className="migrate-button"
            >
              {isMigrating ? 'Migrating...' : 'Migrate to Google Drive'}
            </button>
          </div>
        </div>
      )}

      {showConfig && (
        <div className="config-modal">
          <div className="config-content">
            <h4>Google Drive API Configuration</h4>
            <p>To use Google Drive storage, you need to set up API credentials:</p>
            
            <div className="config-form">
              <div className="form-group">
                <label htmlFor="client-id">Google Client ID:</label>
                <input
                  id="client-id"
                  type="text"
                  value={googleConfig.clientId}
                  onChange={(e) => setGoogleConfig(prev => ({ ...prev, clientId: e.target.value }))}
                  placeholder="Your Google OAuth Client ID"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="api-key">Google API Key:</label>
                <input
                  id="api-key"
                  type="text"
                  value={googleConfig.apiKey}
                  onChange={(e) => setGoogleConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Your Google Drive API Key"
                />
              </div>
              
              <div className="config-help">
                <p><strong>How to get these credentials:</strong></p>
                <ol>
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                  <li>Create a new project or select an existing one</li>
                  <li>Enable the Google Drive API</li>
                  <li>Create credentials (OAuth 2.0 Client ID and API Key)</li>
                  <li>Add your domain (e.g., localhost:3000) to authorized origins</li>
                  <li>For production: Add your actual domain to authorized origins</li>
                </ol>
                <p><strong>Note:</strong> These credentials will be saved in your browser's local storage.</p>
              </div>
              
              <div className="config-buttons">
                <button onClick={handleConfigSave} className="save-button">
                  Save Configuration
                </button>
                <button onClick={() => setShowConfig(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
