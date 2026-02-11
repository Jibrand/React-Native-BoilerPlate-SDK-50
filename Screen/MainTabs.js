import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './Home/Home';
import ExploreScreen from './Explore/Explore';
import ProfileScreen from './Profile/Profile';
import ProfileStack from './Profile/ProfileStack';
import ProfileTab from './Profile/ProfileTab';
import { Image, StyleSheet, View } from 'react-native';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true, // ✅ THIS IS THE FIX
                tabBarStyle: {
                    height: 70,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    position: 'absolute',
                },
            }}
        >
            {/* Home */}
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            {focused ? (
                                <Image
                                    source={require('../assets/Home.png')}
                                    style={styles.logo}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/Home1.png')}
                                    style={styles.disabledLogo}
                                />
                            )}
                        </View>
                    ),
                }}
            />

            {/* Compass / Explore (CENTER) */}
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            {focused ? (
                                <Image
                                    source={require('../assets/Explore.png')}
                                    style={styles.logo}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/Explore1.png')}
                                    style={styles.disabledLogo1}
                                />
                            )}
                        </View>
                    ),
                }}
            />


            <Tab.Screen
                name="Profile"
                component={ProfileTab}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            {focused ? (
                                <Image
                                    source={require('../assets/Profile1.png')}
                                    style={styles.logo}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/Profile.png')}
                                    style={styles.disabledLogo1}
                                />
                            )}
                        </View>
                    ),
                }}
            />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    disabledLogo: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    disabledLogo1: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
})