import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: Date;
  taken: boolean;
}

export const MedicineScreen = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    time: new Date(),
  });

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      time: newMedicine.time,
      taken: false,
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine({ name: '', dosage: '', time: new Date() });
    setModalVisible(false);
  };

  const handleMarkTaken = (id: string) => {
    setMedicines(medicines.map(medicine =>
      medicine.id === id ? { ...medicine, taken: true } : medicine
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Add Medicine Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="plus-circle" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Medicine</Text>
      </TouchableOpacity>

      {/* Medicine List */}
      <View style={styles.medicineList}>
        {medicines.map(medicine => (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.medicineDetails}>
                {medicine.dosage} • {medicine.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.takenButton,
                medicine.taken && styles.takenButtonActive
              ]}
              onPress={() => handleMarkTaken(medicine.id)}
            >
              <Icon
                name={medicine.taken ? 'check-circle' : 'circle-outline'}
                size={24}
                color={medicine.taken ? '#4ECDC4' : theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Medicine Modal */}
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
              onChangeText={text => setNewMedicine({ ...newMedicine, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Dosage"
              value={newMedicine.dosage}
              onChangeText={text => setNewMedicine({ ...newMedicine, dosage: text })}
            />
            
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon name="clock" size={24} color={theme.colors.primary} />
              <Text style={styles.timeButtonText}>
                {newMedicine.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newMedicine.time}
                mode="time"
                is24Hour={true}
                display="default"
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
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddMedicine}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  medicineList: {
    marginBottom: 16,
  },
  medicineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    fontSize: 18,
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
    opacity: 0.5,
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
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
}); 