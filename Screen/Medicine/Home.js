import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { cancelNotification } from '../../utils/notificationHelper';

const Home = ({ navigation }) => {
    const [medicines, setMedicines] = useState([]);

    const loadMedicines = async () => {
        try {
            const stored = await AsyncStorage.getItem('medicines');
            if (stored) {
                setMedicines(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load medicines', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMedicines();
        }, [])
    );

    const deleteMedicine = async (id, notificationId) => {
        Alert.alert(
            "Delete Medicine",
            "Are you sure you want to remove this medication?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updated = medicines.filter(m => m.id !== id);
                        await AsyncStorage.setItem('medicines', JSON.stringify(updated));
                        setMedicines(updated);
                        if (notificationId) {
                            await cancelNotification(notificationId);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name="medical" size={24} color="#FF6B6B" />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    <Text style={styles.medicineDosage}>{item.dosage}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteMedicine(item.id, item.notificationId)}>
                    <Ionicons name="trash-outline" size={24} color="#999" />
                </TouchableOpacity>
            </View>
            <View style={styles.cardFooter}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.timeText}>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>Medicine Agent</Text>
                <Text style={styles.subtitle}>Your daily schedule</Text>
            </View>

            {medicines.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={80} color="#DDD" />
                    <Text style={styles.emptyText}>No medicines scheduled yet.</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => navigation.navigate('AddMedicine')}
                    >
                        <Text style={styles.emptyButtonText}>Add your first medicine</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={medicines}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddMedicine')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 24,
        paddingTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    medicineName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    medicineDosage: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginLeft: 6,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 20,
        textAlign: 'center',
    },
    emptyButton: {
        marginTop: 24,
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    }
});

export default Home;
