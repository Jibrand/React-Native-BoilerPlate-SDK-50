import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/api';
import { useMedicines } from '../MedicineContext';

export default function ClinicTestScreen() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const { t } = useMedicines();

  const loadSurveys = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const userDataStr = await AsyncStorage.getItem('userData');
      const user = userDataStr ? JSON.parse(userDataStr) : null;
      const token = await AsyncStorage.getItem('userToken');

      if (!user || !token) return;

      const response = await api.get(`/surveys/patient/${user.id}`, token);
      if (response.success) {
        setSurveys(response.data);
      }
    } catch (error) {
      console.error('Failed to load surveys:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSurveys(true);
  };

  const updateSurveyStatus = async (item) => {
    // item.id is the response record ID (could be null), item.surveyId is the survey definition ID
    if (item.status === 'answered') return;

    try {
      setUpdatingIds(prev => new Set(prev).add(item.surveyId));

      const userDataStr = await AsyncStorage.getItem('userData');
      const user = userDataStr ? JSON.parse(userDataStr) : null;
      const token = await AsyncStorage.getItem('userToken');

      if (!user || !token) return;

      console.log('Updating survey to answered:', item.title);

      const response = await api.patch(`/surveys/response/${item.id}`, {
        status: 'answered',
        patientId: user.id,
        surveyId: item.surveyId
      }, token);

      if (response.success) {
        // Refresh to stay in sync
        loadSurveys(true);
      }
    } catch (error) {
      console.error('Failed to update survey status:', error);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(item.surveyId);
        return next;
      });
    }
  };

  const handleOpenSurvey = async (item) => {
    try {
      const supported = await Linking.canOpenURL(item.formUrl);
      if (supported) {
        await Linking.openURL(item.formUrl);

        // After opening, ask user if they want to mark it as answered
        if (item.status !== 'answered') {
          Alert.alert(
            "Survey Progress",
            "Have you completed this survey?",
            [
              { text: "No", style: "cancel" },
              {
                text: "Yes, Mark Answered",
                onPress: () => updateSurveyStatus(item)
              }
            ]
          );
        }
      } else {
        Alert.alert("Error", "Cannot open survey link");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong opening the survey");
    }
  };

  // Grouping logic
  const groupSurveysByDate = () => {
    const groups = {};
    surveys.forEach(s => {
      const date = new Date(s.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(s);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  const grouped = groupSurveysByDate();

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#111827']} />
        }
      >
        {grouped.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No surveys assigned yet</Text>
          </View>
        ) : (
          grouped.map(([date, items]) => (
            <View key={date} style={styles.section}>
              <Text style={styles.sectionTitle}>{date}</Text>
              {items.map(item => (
                <SurveyRow
                  key={item.surveyId}
                  item={item}
                  isUpdating={updatingIds.has(item.surveyId)}
                  onPress={() => handleOpenSurvey(item)}
                  onUpdateStatus={() => updateSurveyStatus(item)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function SurveyRow({ item, onPress, onUpdateStatus, isUpdating }) {
  const isAnswered = item.status === 'answered';

  return (
    <View style={styles.surveyRowContainer}>
      <TouchableOpacity
        style={styles.surveyTitleBox}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text style={[styles.surveyText, isAnswered && styles.answeredText]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statusActionBox}
        activeOpacity={0.7}
        disabled={isUpdating}
        onPress={(e) => {
          if (!isAnswered && !isUpdating) {
            onUpdateStatus();
          }
        }}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#111827" />
        ) : isAnswered ? (
          <Ionicons name="checkmark-done" size={24} color="#22C55E" />
        ) : (
          <Ionicons name="ellipse-outline" size={26} color="#111827" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8F8",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F7F8F8",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
    marginLeft: 4,
  },
  surveyRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  surveyTitleBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: 'center',
  },
  statusActionBox: {
    width: 60,
    height: 56, // Matches title box height approx
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  surveyText: {
    fontSize: 15,
    fontWeight: '600',
    color: "#1E293B",
  },
  answeredText: {
    color: "#64748B",
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
    fontWeight: '500',
  },
});
