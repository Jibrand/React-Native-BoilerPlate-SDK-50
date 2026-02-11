import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMedicines } from '../MedicineContext';

export default function AdherenceMedicineList({ navigation }) {
    const { medicines, t } = useMedicines();

    const SUB_ICON_IMAGES = {
        p1: require('../../assets/p1.png'),
        p2: require('../../assets/p2.png'),
        p3: require('../../assets/p3.png'),
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.back}
                    onPress={() => navigation.popToTop()}
                >
                    <Ionicons name="arrow-back" size={18} />
                    <Text style={styles.backText}>
                        {t('back')}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {t('adherence')}
                </Text>

                <View style={styles.headerIcon}>
                    <Image
                        source={require('../../assets/pill1.png')}
                        style={styles.headerIcon}
                    />
                </View>
            </View>

            <View style={{ backgroundColor: "#F7F8F8" }}>


                <View style={styles.divider} />

                {/* LIST */}
                <FlatList
                    data={medicines}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.doseRowContainer}>
                            {/* Box 1: Icon */}
                            <View style={[styles.doseIconBox, { backgroundColor: item.color }]}>
                                {SUB_ICON_IMAGES[item.icon] ? (
                                    <Image
                                        source={SUB_ICON_IMAGES[item.icon]}
                                        style={styles.subIcon}
                                    />
                                ) : (
                                    <Ionicons
                                        name={item.icon}
                                        size={18}
                                        color="#fff"
                                    />
                                )}
                            </View>

                            {/* Box 2: Info */}
                            <View style={styles.doseMiddleBox}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={styles.doseName}>{item.name}</Text>
                                        <Text style={styles.doseSub}>{item.dosage} {item.unit}</Text>
                                    </View>
                                    <Text style={styles.takeInfo}>3 Left</Text>
                                </View>
                            </View>

                            {/* Box 3: Status */}
                            <View style={styles.doseStatusBox}>
                                <Ionicons
                                    name="checkmark-done"
                                    size={20}
                                    color="#16a34a"
                                />
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {t('noMedicines')}
                        </Text>
                    }
                />

                {/* ADD ANOTHER */}
                <TouchableOpacity
                    style={styles.addAnother}
                    onPress={() => navigation.navigate('addmedicine')}
                >
                    <Text style={styles.addAnotherText}>
                        {t('addAnother')}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    /* Header */
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    back: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    backText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '600',
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },

    headerIcon: {
        width: 22,
        height: 22,
        // borderRadius: 16,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
    },

    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },

    /* List */
    list: {
        padding: 16,

    },

    /* NEW 3-BOX LAYOUT STYLES - Synced with AdherenceTab.js */
    doseRowContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 6,
        marginBottom: 12,
    },
    doseIconBox: {
        width: 43,
        height: 43,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow/Border
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    doseMiddleBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    doseStatusBox: {
        width: 43,
        height: 43,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    doseName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    doseSub: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    takeInfo: {
        fontSize: 13,
        fontWeight: '700',
        color: '#EF4444',
    },

    /* Empty */
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#6b7280',
    },

    /* Add another */
    addAnother: {
        margin: 16,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
    },

    addAnotherText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },

    subIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#fff', // makes PNG white like icons
    },

});
