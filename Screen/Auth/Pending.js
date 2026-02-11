import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../utils/api';

const PendingScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['isAuthorized', 'userToken', 'userData']);
        navigation.replace('login');
    };

    const handleCheckStatus = async () => {
        setLoading(true);
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            const token = await AsyncStorage.getItem('userToken');

            if (!userData || !userData.id || !token) {
                Alert.alert('Error', 'Session expired. Please log in again.');
                handleLogout();
                return;
            }

            const response = await api.get(`/patients/${userData.id}`, token);

            if (response.success) {
                const updatedUser = response.data;
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

                if (updatedUser.status === 'Active') {
                    navigation.replace('selectclinicscreen');
                } else if (updatedUser.status === 'Deactive') {
                    Alert.alert('Account Deactivated', 'Your account has been deactivated. Please contact support.');
                    handleLogout();
                } else {
                    Alert.alert('Pending', 'Your account is still awaiting approval.');
                }
            } else {
                Alert.alert('Error', response.message || 'Failed to check status');
            }
        } catch (error) {
            console.error('Check status error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="hourglass-empty" size={80} color="#111827" />
                </View>

                <Text style={styles.title}>Account Pending</Text>

                <Text style={styles.description}>
                    Welcome to the Medicine Agent! Your account has been created successfully.
                </Text>

                <View style={styles.statusBox}>
                    <Text style={styles.statusText}>
                        Wait for your doctor to activate your profile. You will be able to access all features once approved.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.refreshBtn, loading && styles.disabledBtn]}
                    onPress={handleCheckStatus}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.refreshText}>Check Status</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Image source={require('../../assets/zayna.png')} style={styles.logo} />
            </View>
        </View>
    );
};

export default PendingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        marginBottom: 32,
        backgroundColor: '#f3f4f6',
        padding: 24,
        borderRadius: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    statusBox: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 32,
    },
    statusText: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    refreshBtn: {
        width: '100%',
        height: 52,
        backgroundColor: '#111827',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    refreshText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledBtn: {
        opacity: 0.7,
    },
    logoutBtn: {
        padding: 12,
    },
    logoutText: {
        color: '#6b7280',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        paddingBottom: 32,
        alignItems: 'center',
    },
    logo: {
        width: 54,
        height: 54,
        resizeMode: 'contain',
    },
});
