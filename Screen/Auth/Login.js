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
    EMAIL: 1,
};

const LoginScreen = () => {
    const [step, setStep] = useState(STEPS.EMAIL);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const [form, setForm] = useState({
        email: '',
    });
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    const handleNext = async () => {
        setLoading(true);
        Keyboard.dismiss();

        try {
            const response = await api.post('/auth/login/patient', form);

            if (response.success) {
                await AsyncStorage.setItem('isAuthorized', 'true');
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

                setLoading(false);

                if (response.data.user.status === 'Pending') {
                    navigation.replace('pending');
                } else {
                    navigation.replace('selectclinicscreen');
                }
            } else {
                alert(response.message || 'Login failed');
                setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong. Please try again.');
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.title}>Welcome Back!</Text>

                    <TextInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={t => setForm({ ...form, email: t })}
                        style={styles.input}
                    />


                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, !isValid && styles.disabled]}
                            onPress={handleNext}
                            disabled={!isValid || loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Logging in...' : 'Login with Email'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('register')}
                            style={styles.registerLink}
                        >
                            <Text style={styles.registerText}>
                                Don't have an account? <Text style={styles.linkText}>Register now</Text>
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

export default LoginScreen;

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
        fontSize: 24,
        fontWeight: '700',
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
    registerLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: '#4b5563',
    },
    linkText: {
        color: '#000',
        fontWeight: '700',
    },
});