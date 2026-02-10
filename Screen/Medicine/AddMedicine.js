import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { scheduleMedicineNotification, registerForPushNotificationsAsync } from '../../utils/notificationHelper';

const AddMedicine = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || time;
        setShowPicker(Platform.OS === 'ios');
        setTime(currentDate);
    };

    const handleSave = async () => {
        if (!name || !dosage) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Request permissions if not already granted
            await registerForPushNotificationsAsync();

            const notificationId = await scheduleMedicineNotification(name, time);

            const newMedicine = {
                id: Date.now().toString(),
                name,
                dosage,
                time: time.toISOString(),
                notificationId,
            };

            const stored = await AsyncStorage.getItem('medicines');
            const medicines = stored ? JSON.parse(stored) : [];
            medicines.push(newMedicine);

            await AsyncStorage.setItem('medicines', JSON.stringify(medicines));
            navigation.goBack();
        } catch (e) {
            console.error('Failed to save medicine', e);
            alert('An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Add Medication</Text>
                    <Text style={styles.subtitle}>Set your schedule</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Medicine Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Paracetamol"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Dosage</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 1 Tablet (500mg)"
                                value={dosage}
                                onChangeText={setDosage}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Reminder Time</Text>
                            <TouchableOpacity
                                style={styles.timeSelector}
                                onPress={() => setShowPicker(true)}
                            >
                                <Ionicons name="time-outline" size={24} color="#666" />
                                <Text style={styles.timeValue}>
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showPicker && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Schedule Medication'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        padding: 24,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        marginBottom: 32,
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    timeValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginLeft: 12,
    },
    saveButton: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.6,
    }
});

export default AddMedicine;
