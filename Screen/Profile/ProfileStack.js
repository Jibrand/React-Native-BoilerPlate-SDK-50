import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './Profile';
import PersonalInfoScreen from './PersonalInfo';
import RewardsScreen from './Rewards';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={ProfileScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />

      <Stack.Screen name="Rewards" component={RewardsScreen} />

    </Stack.Navigator>
  );
};

export default ProfileStack;
