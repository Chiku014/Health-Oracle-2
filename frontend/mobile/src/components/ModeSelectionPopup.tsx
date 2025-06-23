import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

interface ModeSelectionPopupProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'self' | 'other') => void;
}

export const ModeSelectionPopup = ({ visible, onClose, onSelectMode }: ModeSelectionPopupProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Select Mode</Text>
          
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => onSelectMode('self')}
          >
            <Icon name="account" size={24} color={theme.colors.primary} />
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Self Mode</Text>
              <Text style={styles.modeDescription}>Track your personal health data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => onSelectMode('other')}
          >
            <Icon name="account-group" size={24} color={theme.colors.primary} />
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Other Mode</Text>
              <Text style={styles.modeDescription}>General health data predictions</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 10,
  },
  modeInfo: {
    marginLeft: 15,
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modeDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 