import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationSettingsProps {
  onSave: (settings: { notificationTime: string; enabled: boolean }) => void;
  initialSettings?: {
    notificationTime: string;
    enabled: boolean;
  };
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSave,
  initialSettings = {
    notificationTime: '09:00',
    enabled: true,
  },
}) => {
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [notificationTime, setNotificationTime] = useState(
    new Date(`2000-01-01T${initialSettings.notificationTime}`)
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setNotificationTime(selectedTime);
    }
  };

  const handleSave = () => {
    const timeString = notificationTime.toTimeString().slice(0, 5);
    onSave({
      notificationTime: timeString,
      enabled,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Icon name="bell" size={24} color={theme.colors.primary} />
          <Text style={styles.settingLabel}>Daily Health Summary</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={enabled ? theme.colors.background : theme.colors.textSecondary}
        />
      </View>

      {enabled && (
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Icon name="clock-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.timeText}>
            {notificationTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </TouchableOpacity>
      )}

      {showTimePicker && (
        <Modal
          transparent={true}
          visible={showTimePicker}
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={notificationTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 10,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  doneButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  doneButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 