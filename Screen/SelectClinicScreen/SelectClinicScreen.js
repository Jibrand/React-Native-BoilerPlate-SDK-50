const CLINICS = [
    { id: '1', name: 'Dr Richard Haddad', type: 'Doctor' },
    { id: '2', name: 'Zayna Medical Center', type: 'Clinic' },
    { id: '3', name: 'Gut Health Clinic', type: 'Clinic' },
];


import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SelectClinicScreen = ({ navigation, route }) => {
    const [items, setItems] = useState([{ id: '1', name: 'Dr Richard Haddad', type: 'Doctor' },
    ]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (route.params?.selectedDoctor) {
            setItems(prev => {
                const exists = prev.some(
                    d => d.id === route.params.selectedDoctor.id
                );
                if (exists) return prev;
                return [...prev, route.params.selectedDoctor];
            });
        }
    }, [route.params?.selectedDoctor]);

    return (
        <View style={styles.container}>
            {/* Scan Icon (Top Right) */}
            {/* <TouchableOpacity style={styles.scanIcon}>
<Feather name="maximize" size={22} color="#111827" />
</TouchableOpacity> */}


            {/* Center */}
            <View
                style={[
                    styles.center,
                    items.length === 0
                        ? styles.centerEmpty
                        : styles.centerWithList,
                ]}
            >
                <Text style={styles.title}> Select your healthcare</Text>

                {items.length === 0 ? (
                    <Text style={styles.emptyText}>
                        No doctors or clinics added yet
                    </Text>
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap: 12 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.row,
                                    selectedId === item.id && styles.rowActive,
                                ]}
                                onPress={() => setSelectedId(item.id)}
                            >
                                <Text style={styles.rowText}>{item.name}</Text>
                                <View style={[
                                    styles.radio,
                                    selectedId === item.id && styles.radioActive,
                                ]} />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>

            {/* CTA */}
            {items.length > 0 && (
                <TouchableOpacity
                    style={[
                        styles.button,
                        !selectedId && styles.disabled,
                    ]}
                    onPress={() => navigation.navigate('MainTabs')
                    }
                    disabled={!selectedId}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            )}

            {/* FAB */}
            {/* <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('searchdoctorscreen')}
            >
                <Feather name="plus" size={24} color="#fff" />
            </TouchableOpacity> */}


        </View>
    );
};

export default SelectClinicScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    center: {
        flex: 1,
        paddingHorizontal: 32,
    },

    centerEmpty: {
        justifyContent: 'center',
    },

    centerWithList: {
        justifyContent: 'flex-start',
        paddingTop: 120, // 👈 THIS is the spacing you want
    },

    title: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 32,
        color: '#111827',
    },

    list: {
        gap: 12,
    },

    row: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    rowActive: {
        borderColor: '#111827',
    },

    rowText: {
        fontSize: 14,
        color: '#111827',
    },

    radio: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#9ca3af',
    },

    radioActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },

    addRow: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },

    addText: {
        fontSize: 14,
        color: '#111827',
    },

    button: {
        height: 48,
        backgroundColor: '#000',
        marginHorizontal: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 140,
    },

    disabled: {
        opacity: 0.4,
    },

    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    previous: {
        position: 'absolute',
        bottom: 90,
        left: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },

    previousArrow: {
        fontSize: 16,
        marginRight: 6,
    },

    previousText: {
        fontSize: 13,
        color: '#111827',
    },

    footer: {
        position: 'absolute',
        bottom: 32,
        alignSelf: 'center',
    },

    logo: {
        width: 54,
        height: 54,
        resizeMode: 'contain',
        borderRadius: 5
    },

    emptyText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },

    fab: {
        position: 'absolute',
        bottom: 40,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EDEDED',
        // elevation: 6,
    },
    scanIcon: {
        position: 'absolute',
        top: 10,        // adjust for status bar
        right: 24,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6', // light gray
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

});
