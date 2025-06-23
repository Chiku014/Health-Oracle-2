import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  time: Date;
  taken: boolean;
}

interface MedicineListProps {
  medicines: Medicine[];
  onAddMedicine: (medicine: Omit<Medicine, '_id' | 'taken'>) => void;
  onMarkTaken: (id: string) => void;
}

export const MedicineList: React.FC<MedicineListProps> = ({ medicines, onAddMedicine, onMarkTaken }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    time: new Date(),
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onAddMedicine(newMedicine);
    setModalVisible(false);
    setNewMedicine({ name: '', dosage: '', time: new Date() });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicine Schedule</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="plus-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {medicines.map((medicine) => (
        <View key={medicine._id} style={styles.medicineItem}>
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text style={styles.medicineDetails}>
              {medicine.dosage} at {medicine.time.toLocaleTimeString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onMarkTaken(medicine._id)}
            style={[
              styles.takenButton,
              medicine.taken && styles.takenButtonActive
            ]}
          >
            <Icon
              name={medicine.taken ? 'check-circle' : 'circle-outline'}
              size={24}
              color={medicine.taken ? theme.colors.success : theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medicine</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Medicine Name"
              value={newMedicine.name}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Dosage"
              value={newMedicine.dosage}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, dosage: text })}
            />
            
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>Time: {newMedicine.time.toLocaleTimeString()}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newMedicine.time}
                mode="time"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setNewMedicine({ ...newMedicine, time: selectedTime });
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddMedicine}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  medicineDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  takenButton: {
    padding: 8,
  },
  takenButtonActive: {
    backgroundColor: theme.colors.success + '20',
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.error + '20',
  },
  addButton: {
    backgroundColor: theme.colors.primary + '20',
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
}); 