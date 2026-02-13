import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const registerForPushNotificationsAsync = async () => {
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
            console.warn('Failed to get push token for push notification!');
            return false;
        }
        return true;
    } else {
        console.log('Must use physical device for Push Notifications');
        return false;
    }
};

/**
 * Schedule notifications for medication logs
 * @param {Array} logs - Array of medication log objects from backend
 */
export const scheduleMedicationNotifications = async (logs) => {
    try {
        const now = new Date();
        console.log('--- Syncing Medication Reminders ---');
        console.log(`Current System Time: ${now.toLocaleString()}`);
        console.log(`Total logs received from server: ${logs?.length || 0}`);

        // 1. Cancel all existing medication notifications to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Cleared existing scheduled notifications');

        if (!logs || logs.length === 0) {
            console.log('No logs found to schedule.');
            return;
        }

        // 2. Schedule each log
        let scheduledCount = 0;

        // iOS has a limit of 64 local notifications.
        const limitedLogs = logs.slice(0, 60);

        for (const log of limitedLogs) {
            const { scheduledDate, scheduledTime, name, dosage, id } = log;

            // trigger input: scheduledDate="2024-10-14", scheduledTime="08:00"
            const [year, month, day] = scheduledDate.split('-').map(Number);
            const [hour, minute] = scheduledTime.split(':').map(Number);

            // new Date(year, monthIndex, day, hour, minute) is ALWAYS local
            const triggerDate = new Date(year, month - 1, day, hour, minute, 0);

            if (triggerDate > now) {
                // console.log(`Scheduling: "${name}" for ${triggerDate.toLocaleString()}`);
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `💊 Reminder: ${name}`,
                        body: `It's time to take ${dosage} of ${name}.`,
                        data: { logId: id, medicationId: log.medicationId },
                        sound: 'default',
                        priority: Notifications.AndroidNotificationPriority.MAX,
                    },
                    trigger: triggerDate,
                });
                scheduledCount++;
            }
        }
        console.log(`Successfully scheduled ${scheduledCount} future reminders.`);
        console.log('------------------------------------');
    } catch (error) {
        console.error('Error scheduling notifications:', error);
    }
};

export const sendTestNotification = async () => {
    console.log('Sending test notification in 5 seconds...');
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🧪 Test Notification",
            body: "If you see this, notifications are working!",
            data: { test: true },
        },
        trigger: { seconds: 5 },
    });
};

export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};
