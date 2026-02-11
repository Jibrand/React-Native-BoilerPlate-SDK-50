import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useMedicines } from '../MedicineContext';
import AppHeaderleft from '../../components/AppHeaderleft';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/api';

const PersonalInfoScreen = ({ navigation }) => {
  const { t } = useMedicines();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setName(userData.name || '');
        setEmail(userData.email || '');
        setBirthday(userData.dob || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (birthday && !/^\d{2}\/\d{2}\/\d{4}$/.test(birthday)) {
      Alert.alert('Invalid Date', 'Please enter a valid birthday in DD/MM/YYYY format');
      return;
    }

    if (birthday) {
      const [day, month, year] = birthday.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();
      if (
        month > 12 || month < 1 ||
        day > 31 || day < 1 ||
        year > now.getFullYear() || year < 1900 ||
        date.getMonth() !== month - 1 || // Handles cases like 31/04/2023
        date > now
      ) {
        Alert.alert('Invalid Date', 'Please enter a realistic birthday.');
        return;
      }
    }

    setLoading(true);
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const token = await AsyncStorage.getItem('userToken');

      if (!userData || !userData.id || !token) {
        Alert.alert('Error', 'Session expired');
        return;
      }

      const response = await api.patch(`/patients/${userData.id}`, {
        name: name,
        dob: birthday
      }, token);

      if (response.success) {
        const updatedUser = { ...userData, name, dob: birthday };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('personalInfo')} showBack />

      <View style={styles.content}>
        {fetching ? (
          <ActivityIndicator size="large" color="#111827" style={{ marginTop: 50 }} />
        ) : (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />

            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
            />

            <Text style={styles.label}>{t('birthday')}</Text>
            <TextInput
              style={styles.input}
              value={birthday}
              onChangeText={text => {
                const cleaned = text.replace(/\D/g, '');
                let formatted = cleaned;
                if (cleaned.length > 2 && cleaned.length <= 4) {
                  formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                } else if (cleaned.length > 4) {
                  formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                }
                setBirthday(formatted);
              }}
              placeholder="DD / MM / YYYY"
              maxLength={10}
              keyboardType="number-pad"
            />
          </>
        )}
      </View>

      {/* SAVE BUTTON FIXED AT BOTTOM */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, (loading || fetching) && styles.disabledBtn]}
          onPress={handleSave}
          disabled={loading || fetching}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>{t('save')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
    padding: 10

  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 2,
    marginTop: 20,
    color: '#111827',
  },

  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },

  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  saveBtn: {
    height: 56,
    backgroundColor: '#111827',
    borderRadius: 16,
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
