import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
  Switch,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useProfile } from '../context/ProfileContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { usePrediction } from '../hooks/usePrediction';
import { NotificationSettings } from '../components/NotificationSettings';
import { theme } from '../theme';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export const ProfileScreen = ({ navigation }: any) => {
  const { profile, loading, error } = useProfile();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-50);
  const { updateNotificationSettings } = usePrediction();
  const [notificationSettings, setNotificationSettings] = useState<{
    notificationTime: string;
    enabled: boolean;
    tag?: string;
  }>({
    notificationTime: '09:00',
    enabled: true,
    tag: ''
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "This feature is coming soon!",
      [{ text: "OK" }]
    );
  };

  const handleNotifications = () => {
    const newSettings = {
      enabled: !notificationSettings.enabled,
      notificationTime: notificationSettings.notificationTime,
      tag: notificationSettings.tag || ''
    };
    
    setNotificationSettings(newSettings);
    handleSaveNotificationSettings(newSettings);
    
    Alert.alert(
      "Notification Settings",
      `Notifications have been ${newSettings.enabled ? 'enabled' : 'disabled'}`,
      [{ text: "OK" }]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      "Privacy Settings",
      "This feature is coming soon!",
      [{ text: "OK" }]
    );
  };

  const handleAboutUs = () => {
    Alert.alert(
      "About Health Oracle",
      "Health Oracle is your personal health companion, providing AI-powered predictions and insights to help you maintain a healthy lifestyle.",
      [{ text: "OK" }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Need assistance? Contact our support team at support@healthoracle.com",
      [{ text: "OK" }]
    );
  };

  const handleTermsPrivacy = () => {
    Alert.alert(
      "Terms & Privacy Policy",
      "This feature is coming soon!",
      [{ text: "OK" }]
    );
  };

  const handleRateUs = () => {
    Alert.alert(
      "Rate Us",
      "Thank you for using Health Oracle! Please rate us on the app store.",
      [{ text: "OK" }]
    );
  };

  const handleSaveNotificationSettings = async (settings: {
    notificationTime: string;
    enabled: boolean;
    tag?: string;
  }) => {
    try {
      await updateNotificationSettings(settings);
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No profile data available'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.age}</Text>
                <Text style={styles.statLabel}>Age</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.bmi.toFixed(1)}</Text>
                <Text style={styles.statLabel}>BMI</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.biologicalAge}</Text>
                <Text style={styles.statLabel}>Bio Age</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Notification Settings */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <NotificationSettings
            onSave={handleSaveNotificationSettings}
            initialSettings={notificationSettings}
          />
        </Animated.View>

        {/* Account Settings */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <Icon name="account-edit" size={24} color="#4A90E2" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color="#C0C0C0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
            <Icon name="bell-outline" size={24} color="#FF9F43" />
            <Text style={styles.menuText}>Notifications</Text>
            <View style={styles.notificationToggle}>
              <Switch
                value={notificationSettings.enabled}
                onValueChange={handleNotifications}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.enabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacySettings}>
            <Icon name="shield-lock-outline" size={24} color="#6C5CE7" />
            <Text style={styles.menuText}>Privacy Settings</Text>
            <Icon name="chevron-right" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        </Animated.View>

        {/* App Information */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>About Health Oracle</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleAboutUs}>
            <Icon name="information" size={24} color="#4ECDC4" />
            <Text style={styles.menuText}>About Us</Text>
            <Icon name="chevron-right" size={24} color="#C0C0C0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelpSupport}>
            <Icon name="help-circle" size={24} color="#FF6B6B" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color="#C0C0C0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleTermsPrivacy}>
            <Icon name="file-document" size={24} color="#4A90E2" />
            <Text style={styles.menuText}>Terms & Privacy Policy</Text>
            <Icon name="chevron-right" size={24} color="#C0C0C0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleRateUs}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.menuText}>Rate Us</Text>
            <Icon name="chevron-right" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        </Animated.View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    marginLeft: 15,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#636E72',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    width: 150,
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
}); 