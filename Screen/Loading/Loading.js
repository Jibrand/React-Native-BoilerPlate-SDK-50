import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from './global';

const LoadingScreen = () => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const [showLoading, setShowLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        const checkFirstVisit = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 3000));

                const isFirstVisit = await AsyncStorage.getItem('isFirstVisit');
                const isAuth = await AsyncStorage.getItem('isAuthorized');
                const userDataStr = await AsyncStorage.getItem('userData');
                const userData = userDataStr ? JSON.parse(userDataStr) : null;

                if (isFirstVisit === null) {
                    await AsyncStorage.setItem('isFirstVisit', 'false');
                    navigation.replace('register');
                    return;
                }

                if (isAuth === 'true' && userData) {
                    // Check status again to be safe
                    if (userData.status === 'Pending') {
                        navigation.replace('pending');
                    } else {
                        navigation.replace('selectclinicscreen');
                    }
                } else {
                    navigation.replace('login');
                }
            } catch (error) {
                console.error('Failed to check visit status', error);
            }
        };

        checkFirstVisit();

        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [rotateAnim, navigation]);

    return (
        <>
            <StatusBar barStyle="light-content" />
            <View style={GlobalStyles.container}>
                <Image
                    source={require('../../assets/zayna.png')}
                    style={GlobalStyles.icon}
                />
                {/* <Text style={GlobalStyles.subtitle}>Discover Your Potential.</Text> */}
            </View>
        </>
    );
};



export default LoadingScreen;
