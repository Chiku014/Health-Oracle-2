import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';
import HealthConnectService from '../services/healthConnect';

const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata';
const PLAY_STORE_URL = `market://details?id=${HEALTH_CONNECT_PACKAGE}`;

const HealthConnectButton: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    checkHealthConnectStatus();
  }, []);

  const checkHealthConnectStatus = async () => {
    try {
      // Check if Health Connect is installed
      const hasPermissions = await HealthConnectService.checkPermissions();
      setIsConnected(hasPermissions);
      setIsInstalled(true);
    } catch (error) {
      // If we get an error, assume Health Connect is not installed
      setIsInstalled(false);
      setIsConnected(false);
    }
  };

  const handleInstall = () => {
    Linking.openURL(PLAY_STORE_URL).catch(() => {
      // If market:// scheme fails, try the web URL
      Linking.openURL(`https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PACKAGE}`);
    });
  };

  const handleConnect = async () => {
    try {
      await HealthConnectService.requestPermissions();
      await checkHealthConnectStatus();
    } catch (error) {
      console.error('Error connecting to Health Connect:', error);
    }
  };

  if (!isInstalled) {
    return (
      <TouchableOpacity style={styles.button} onPress={handleInstall}>
        <Text style={styles.buttonText}>Install Health Connect</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.button, isConnected ? styles.connectedButton : null]}
      onPress={handleConnect}
      disabled={isConnected}
    >
      <Text style={styles.buttonText}>
        {isConnected ? 'Connected to Health Connect' : 'Connect Health Connect'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  connectedButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HealthConnectButton;