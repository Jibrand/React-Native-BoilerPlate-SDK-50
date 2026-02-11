import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import ProfileScreen from './Profile';
import RewardsScreen from './Rewards';
import Perks from './Perks';
import AppHeaderleft from '../../components/AppHeaderleft';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
    const [activeTab, setActiveTab] = useState('Rewards');

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <AppHeaderleft title="Account" />

            {/* TOP TABS */}
            <View style={styles.tabsRow}>
                {['Rewards', 'Perks', 'Settings'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tabItem}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive,
                            ]}
                        >
                            {tab}
                        </Text>
                        {activeTab === tab && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* CONTENT AREA */}
            <View style={{ flex: 1 }}>
                {activeTab === 'Rewards' && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <RewardsScreen />
                    </ScrollView>
                )}

                {activeTab === 'Perks' && (
                    <Perks />
                )}

                {activeTab === 'Settings' && (
                    <ProfileScreen />
                )}
            </View>
        </View>

    );
}

export default ExploreScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    /* Tabs */
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },

    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },

    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9ca3af',
    },

    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
    },

    activeTabText: {
        color: '#111827',
        fontWeight: '600',
    },

    /* Content */
    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 120, // footer space

    },

    promoCard: {
        height: 190,
        borderRadius: 24,
        backgroundColor: '#9ca3af',
        padding: 24,
        justifyContent: 'center',  // keeps content vertically centered
        alignItems: 'center',      // 🔥 centers title + subtitle + button
        marginVertical: 24,
    },


    promoTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',

    },

    promoSub: {
        fontSize: 14,
        color: '#e5e7eb',
    },

    promoBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
        alignSelf: 'center',   // ✅ centers horizontally
        marginTop: 12,
    },


    promoBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },

    /* Categories */
    categories: {
        paddingRight: 16,
    },

    categoryBox: {
        width: 120,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        gap: 8,
    },

    categoryActive: {
        borderWidth: 1.5,
        borderColor: '#111827',
    },

    categoryText: {
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'center',
    },

    categoryTextActive: {
        color: '#111827',
        fontWeight: '600',
    },
    boxScroll: {
        paddingRight: 16,
    },

    boxWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 220,              // 🔥 REQUIRED for 2 rows
        width: 380,               // controls how many per column
    },

    categoryBox: {
        width: 120,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 14,
        marginBottom: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },

    categoryText: {
        fontSize: 13,
        color: '#111827',
        textAlign: 'center',
        fontWeight: '500',
    },

    treatmentScroll: {
        paddingTop: 16,
        paddingRight: 16,
    },

    treatmentCard: {
        width: 140,
        height: 110,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },

    treatmentActive: {
        borderWidth: 2,
        borderColor: '#111827', // active outline like figma
    },

    treatmentText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        textAlign: 'center',
    },

    tabsRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },


    tabItem: {
        paddingVertical: 14,
        alignItems: 'center',
        flex: 1,
    },

    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#9ca3af',
    },

    tabTextActive: {
        color: '#111827',
        fontWeight: '600',
    },

    tabIndicator: {
        marginTop: 8,
        height: 3,
        width: 24,
        borderRadius: 2,
        backgroundColor: '#111827',
    },
    tabsRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },

    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },

    tabText: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    },

    tabTextActive: {
        color: '#111827',
        fontWeight: '600',
    },

    tabUnderline: {
        marginTop: 6,
        height: 2,
        width: '100%',
        backgroundColor: '#111827',
    },

    promoCard: {
        height: 190,
        borderRadius: 24,
        backgroundColor: '#9ca3af',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center', // ✅ centers everything
        marginVertical: 24,
    },

    promoTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },

    promoSub: {
        fontSize: 14,
        color: '#e5e7eb',
        textAlign: 'center',
        marginBottom: 16,
    },

    promoBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 14,
        alignSelf: 'center', // ✅ THIS NOW WORKS
    },

    promoBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },


    horizontalGrid: {
        paddingRight: 16,
    },

    gridWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 320,          // controls how many cards per swipe
        height: 230,         // REQUIRED for 2 rows
    },

    categoryCard: {
        width: 120,              // ⬅️ slightly smaller
        height: 96,
        backgroundColor: '#fff',
        borderRadius: 18,
        marginRight: 4,
        marginBottom: 4,
        position: 'relative',
        elevation: 2,
    },

    categoryActive: {
        borderWidth: 2,
        borderColor: '#111827',
    },

    imageHolder: {
        height: 50,              // ⬅️ reserved space for image
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    categoryImage: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },

    categoryText: {
        position: 'absolute',
        bottom: 10,              // ⬅️ text locked to bottom
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },


});
