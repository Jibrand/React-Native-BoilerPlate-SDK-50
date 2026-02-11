import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { useMedicines } from '../MedicineContext';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../utils/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ }) => {
  const { language, toggleLanguage, t } = useMedicines();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['isAuthorized', 'userToken', 'userData']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    } catch (e) {
      console.error('Error logging out:', e);
    }
  };

  const handleDeactivate = async () => {
    Alert.alert(
      t('deleteAccount'),
      'Are you sure you want to deactivate your account? You will be logged out and unable to access your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const userDataStr = await AsyncStorage.getItem('userData');
              const userData = userDataStr ? JSON.parse(userDataStr) : null;
              const token = await AsyncStorage.getItem('userToken');

              if (!userData || !userData.id || !token) {
                handleLogout();
                return;
              }

              const response = await api.patch(`/patients/${userData.id}`, {
                status: 'Deactive'
              });

              if (response.success) {
                Alert.alert('Success', 'Your account has been deactivated.');
                handleLogout();
              } else {
                Alert.alert('Error', response.message || 'Failed to deactivate account');
              }
            } catch (error) {
              console.error('Deactivate error:', error);
              Alert.alert('Error', 'Something went wrong');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* 🌍 LANGUAGE TOGGLE */}
        <View style={styles.menuItem}>
          <View>
            <Text style={styles.menuText}>{t('language')}</Text>
            <Text style={styles.subText}>
              {language === 'en' ? t('english') : t('spanish')}
            </Text>
          </View>

          <Switch
            value={language === 'es'}
            onValueChange={toggleLanguage}
            trackColor={{ true: '#a7f3d0', false: '#e5e7eb' }}
            thumbColor="#34d399"
          />
        </View>

        {/* Personal infos */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('personalinfo')}
        >
          <Text style={styles.menuText}>{t('personalInfo')}</Text>
          <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={[styles.menuItem, loading && styles.disabledItem]}
          onPress={handleDeactivate}
          disabled={loading}
        >
          <Text style={styles.menuText}>{t('deleteAccount')}</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Feather name="trash-2" size={20} color="#ef4444" />
          )}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>{t('logout')}</Text>
          <Ionicons name="log-out-outline" size={22} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  rewardsCard: {
    height: 86,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
  },

  rewardsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },

  menuItem: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  disabledItem: {
    opacity: 0.6,
  },
});
