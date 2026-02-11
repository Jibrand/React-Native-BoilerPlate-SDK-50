import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useMedicines } from '../MedicineContext';
import { api } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const MAX_WORDS = 250;

const AskQuestionModal = ({ visible, onClose, onSubmit }) => {
    const { t } = useMedicines();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const words = text.trim().split(/\s+/).filter(Boolean).length;



    //   const handleAsk = () => {
    //     if (!text.trim()) return;
    //     onSubmit(text.trim());
    //     setText('');
    //     onClose();
    //   };


    const handleAsk = async () => {
        if (!text.trim() || loading) return;

        try {
            setLoading(true);
            const userDataStr = await AsyncStorage.getItem('userData');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            const token = await AsyncStorage.getItem('userToken');

            if (!userData || !userData.id || !token) {
                Alert.alert('Error', 'Please login to ask a question');
                return;
            }

            const response = await api.post('/qna', {
                patientId: userData.id,
                question: text.trim()
            });

            if (response.success) {
                onSubmit();
                setText('');
                onClose();
            } else {
                Alert.alert('Limit Reached', response.message || 'Unable to submit your question.');
            }
        } catch (err) {
            console.error('Ask question error:', err);
            Alert.alert(
                'Error',
                'Unable to submit your question. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.backdrop} />

            <KeyboardAvoidingView
                style={styles.wrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>
                        {t('questionLabel')}
                    </Text>

                    <TextInput
                        multiline
                        value={text}
                        onChangeText={setText}
                        placeholder={t('askPlaceholder')}
                        style={styles.input}
                        maxLength={1500}
                    />

                    <Text style={styles.counter}>
                        ({words}/{MAX_WORDS} {t('words')})
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.cancel}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>
                                {t('cancel')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.ask,
                                (!text.trim() || loading) && { opacity: 0.5 },
                            ]}
                            onPress={handleAsk}
                            disabled={!text.trim() || loading}
                        >
                            <Text style={styles.askText}>
                                {loading ? '...' : t('ask')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.note}>
                        {t('noteWeekly')}
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AskQuestionModal;


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },

    card: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 20,
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },

    input: {
        minHeight: 140,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        textAlignVertical: 'top',
    },

    counter: {
        textAlign: 'right',
        fontSize: 12,
        color: '#6b7280',
        marginTop: 6,
    },

    actions: {
        flexDirection: 'row',
        marginTop: 16,
    },

    cancel: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        marginRight: 10,
        alignItems: 'center',
    },

    cancelText: {
        fontWeight: '600',
    },

    ask: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#6b7280',
        alignItems: 'center',
    },

    askText: {
        color: '#fff',
        fontWeight: '600',
    },

    note: {
        marginTop: 12,
        fontSize: 12,
        color: '#6b7280',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

});
