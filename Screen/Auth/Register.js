import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../utils/api';

const STEPS = {
    EMAIL: 0,
    BIRTHDAY: 1,
    NAME: 2,
};

const SignupScreen = () => {
    const [step, setStep] = useState(STEPS.EMAIL);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const [form, setForm] = useState({
        email: '',
        birthday: '',
        name: '',
    });

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem('signupData');
            if (saved) {
                setForm(JSON.parse(saved));
            }
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('signupData', JSON.stringify(form));
    }, [form]);

    useEffect(() => {
        AsyncStorage.setItem('signupStep', step.toString());
    }, [step]);

    useEffect(() => {
        (async () => {
            const savedForm = await AsyncStorage.getItem('signupData');
            const savedStep = await AsyncStorage.getItem('signupStep');

            if (savedForm) setForm(JSON.parse(savedForm));
            if (savedStep) setStep(Number(savedStep));
        })();
    }, []);

    const isStepValid = () => {
        switch (step) {
            case STEPS.EMAIL:
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

            case STEPS.BIRTHDAY:
                return /^\d{2}\/\d{2}\/\d{4}$/.test(form.birthday);

            case STEPS.NAME:
                return form.name.trim().length >= 2;

            default:
                return false;
        }
    };

    const handleNext = async () => {
        if (step < STEPS.NAME) {
            setStep(step + 1);
        } else {
            setLoading(true);
            Keyboard.dismiss();

            try {
                const response = await api.post('/auth/register/patient', {
                    name: form.name,
                    email: form.email,
                    dob: form.birthday
                });

                if (response.success) {
                    await AsyncStorage.removeItem('signupData');
                    await AsyncStorage.removeItem('signupStep');

                    if (response.data && response.data.token) {
                        await AsyncStorage.setItem('userToken', response.data.token);
                        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
                        await AsyncStorage.setItem('isAuthorized', 'true');
                    }

                    setLoading(false);
                    navigation.replace('pending');
                } else {
                    alert(response.message || 'Registration failed');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Something went wrong. Please try again.');
                setLoading(false);
            }
        }
    };

    const getTitle = () => {
        switch (step) {
            case STEPS.EMAIL:
                return 'Enter your Email';
            case STEPS.BIRTHDAY:
                return 'Your Birthday';
            case STEPS.NAME:
                return 'Your Name';
        }
    };

    const getButtonText = () => step === STEPS.NAME ? 'Create account' : 'Continue';

    const renderInput = () => {
        switch (step) {
            case STEPS.EMAIL:
                return (
                    <TextInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={t => setForm({ ...form, email: t })}
                        style={styles.input}
                    />
                );

            case STEPS.BIRTHDAY:
                return (
                    <TextInput
                        placeholder="DD / MM / YYYY"
                        maxLength={10}
                        value={form.birthday}
                        onChangeText={t => {
                            const cleaned = t.replace(/\D/g, '');
                            let formatted = cleaned;
                            if (cleaned.length > 4)
                                formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                            setForm({ ...form, birthday: formatted });
                        }}

                        style={styles.input}
                    />
                );

            case STEPS.NAME:
                return (
                    <TextInput
                        placeholder="Full name"
                        keyboardType="default"
                        autoCapitalize="words"

                        value={form.name}
                        onChangeText={t => setForm({ ...form, name: t })}
                        style={styles.input}
                    />
                );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.title}>{getTitle()}</Text>

                    {renderInput()}

                    {/* Back + Next */}
                    {step > STEPS.EMAIL && (
                        <TouchableOpacity
                            style={styles.previousBtn}
                            onPress={() => setStep(step - 1)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name="arrow-back-ios"
                                size={16}
                                color="#000000"
                            />
                            <Text style={styles.previousText}>Previous</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.actions}>

                        <TouchableOpacity
                            style={[styles.button, !isStepValid() && styles.disabled]}
                            onPress={handleNext}
                            disabled={!isStepValid() || loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Creating...' : getButtonText()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer stays fixed */}
                <View style={styles.footer}>
                    <Image source={require('../../assets/zayna.png')} style={styles.logo} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },


    title: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 24,
        color: '#111827',
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#9ca3af',
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 24,
        fontSize: 14,
    },

    button: {
        height: 48,
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
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
        // borderRadius: 5
    },
    actions: {
        gap: 16,
    },

    backText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 14,
    },

    disabled: {
        opacity: 0.5,
    },

    previousBtn: {
        position: 'absolute',
        bottom: 100,          // sits above logo like Figma
        left: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },

    previousArrow: {
        fontSize: 16,
        color: '#111827',
        marginRight: 6,
    },

    previousText: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '700',
    },

});