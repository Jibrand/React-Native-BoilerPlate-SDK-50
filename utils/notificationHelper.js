import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (e) {
            console.log("Error getting push token", e);
        }
    } else {
        // alert('Must use physical device for Push Notifications');
    }

    return token;
}

export async function scheduleMedicineNotification(medicineName, time) {
    const trigger = new Date(time);

    // If the time is in the past, set it for tomorrow
    if (trigger <= new Date()) {
        trigger.setDate(trigger.getDate() + 1);
    }

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "💊 Time for your medicine!",
            body: `Don't forget to take your ${medicineName}.`,
            sound: true,
        },
        trigger: {
            hour: trigger.getHours(),
            minute: trigger.getMinutes(),
            repeats: true,
        },
    });
    return identifier;
}

export async function cancelNotification(identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}
