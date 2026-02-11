import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QABox from './QABox';
import AskQuestionModal from './AskQuestionModal';
import Blogs from './Blogs';
import Tests from './Tests';
import { useMedicines } from '../MedicineContext';
import Report from './Report';
import { api } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const TAB_BAR_HEIGHT = 70;

const ConsultantTab = () => {
    const [active, setActive] = useState('Q&A');
    const [showModal, setShowModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useMedicines();

    const loadQuestions = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            const userDataStr = await AsyncStorage.getItem('userData');
            const user = userDataStr ? JSON.parse(userDataStr) : null;
            const token = await AsyncStorage.getItem('userToken');

            if (!user || !token) return;

            // REAL-TIME CHECK: Fetch latest patient data to verify reportsAllowed
            const patientRes = await api.get(`/patients/${user.id}`, token);
            if (patientRes.success) {
                const refreshedUser = patientRes.data;
                setUserData(refreshedUser);
                await AsyncStorage.setItem('userData', JSON.stringify(refreshedUser));
            } else {
                setUserData(user);
            }

            // Fetch ALL ACTIVE ANSWERED questions (Public View)
            const response = await api.get(`/qna?status=Answered`, token);

            if (response.success) {
                setQuestions(response.data);
            }
        } catch (e) {
            console.log('Failed to load questions', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadQuestions(true);
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    // Filter tabs based on reportsAllowed
    const allTabs = ['Report', 'Test', 'Q&A', 'Blogs'];
    const displayedTabs = userData?.reportsAllowed === 1
        ? allTabs
        : allTabs.filter(tab => tab !== 'Report');

    // Set default active tab if 'Report' was active but is now hidden
    useEffect(() => {
        if (userData?.reportsAllowed !== 1 && active === 'Report') {
            setActive('Q&A');
        }
    }, [userData, active]);

    return (
        <SafeAreaView style={styles.container}>
            {/* 🔒 FIXED TOP TABS */}
            <View style={styles.pillsWrapper}>
                {displayedTabs.map(tab => {
                    const isActive = tab === active;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActive(tab)}
                            style={[styles.pill, isActive && styles.pillActive]}
                        >
                            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ✅ CONTENT AREA - No outer ScrollView here to avoid nesting issues */}
            <View style={{ flex: 1 }}>
                {active === 'Q&A' && (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#111827']} />
                        }
                    >
                        {loading && !refreshing ? (
                            <ActivityIndicator size="small" color="#111827" style={{ marginTop: 20 }} />
                        ) : (
                            <QABox questions={questions} />
                        )}
                    </ScrollView>
                )}
                {active === 'Test' && <Tests />}
                {active === 'Report' && <Report />}
                {active === 'Blogs' && (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Blogs />
                    </ScrollView>
                )}
            </View>
            {active === 'Q&A' &&
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.9}
                    onPress={() => setShowModal(true)}
                >
                    <Ionicons name="add" size={26} color="#171717ff" />
                </TouchableOpacity>
            }

            <AskQuestionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={() => loadQuestions()}
            />
        </SafeAreaView>
    );
};

export default ConsultantTab;

const Placeholder = ({ title }) => (
    <View style={styles.card}>
        <Text style={styles.bold}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8F8',
    },

    pillsWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#F7F8F8',
    },

    pill: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 22,
        // borderWidth: 1,
        // borderColor: '#e5e7eb',
        marginRight: 10,
        backgroundColor: '#fff',
    },

    pillActive: {
        backgroundColor: '#E4E3E4',
        borderColor: '#E4E3E4',
        color: '#111827',
    },

    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    pillTextActive: {
        color: '#111827',
    },

    /* Scroll content */
    scrollContent: {
        padding: 16,
    },

    /* Card */
    card: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        backgroundColor: '#fff',
    },

    text: {
        fontSize: 13.5,
        lineHeight: 19,
        color: '#374151',
    },

    bold: {
        fontWeight: '700',
        color: '#111827',
    },

    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 12,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: TAB_BAR_HEIGHT + 40, // ✅ no fake spacer needed
    },

    /* Floating Button */
    fab: {
        position: 'absolute',
        right: 16, // 👈 bottom-left (change to right:16 if needed)
        bottom: TAB_BAR_HEIGHT + 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E4E3E4',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
            },
            android: {
                borderWidth: 1,
                borderColor: '#EDEDED',
                // elevation: 6,
            },
        }),
    },
});
