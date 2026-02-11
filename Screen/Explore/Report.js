import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../utils/api";
import ReportModal from "./ReportModal";
import ReportDetailModal from "./ReportDetailModal";

const DAYS_RANGE = 30; // Reduced for performance, can adjust
const ITEM_WIDTH = 65;

export default function ClinicReportScreen() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const dates = useMemo(() => {
    return Array.from({ length: DAYS_RANGE * 2 + 1 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i - DAYS_RANGE);
      return d;
    });
  }, [today]);

  const loadReports = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const userDataStr = await AsyncStorage.getItem("userData");
      const user = userDataStr ? JSON.parse(userDataStr) : null;
      const token = await AsyncStorage.getItem("userToken");

      if (!user || !token) return;

      // Format date to YYYY-MM-DD using local time to avoid timezone shifts
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const response = await api.get(
        `/reports?patientId=${user.id}&date=${formattedDate}`,
        token
      );

      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const onRefresh = () => {
    setRefreshing(true);
    loadReports(true);
  };

  const getSmartDateLabel = (date) => {
    const diff = Math.floor(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked":
        return "#22C55E";
      case "Follow up":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <View style={styles.safe}>
      {/* Date Slider */}
      <View style={styles.sliderWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          keyExtractor={(_, i) => i.toString()}
          initialScrollIndex={DAYS_RANGE}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          contentContainerStyle={styles.slider}
          renderItem={({ item }) => {
            const isSelected =
              item.toDateString() === selectedDate.toDateString();

            return (
              <TouchableOpacity
                onPress={() => setSelectedDate(item)}
                style={styles.dayWrapper}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                  {item.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>

                <View
                  style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.dayNumberActive,
                    ]}
                  >
                    {item.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#111827"]} />
        }
      >
        <Text style={styles.todayText}>
          {getSmartDateLabel(selectedDate)}
        </Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#111827" style={{ marginTop: 50 }} />
        ) : reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No reports for this date</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyButtonText}>Add Report Note</Text>
            </TouchableOpacity>
          </View>
        ) : (
          reports.map((item) => (
            <View key={item.id} style={styles.noteCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.reportTime}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={styles.reportContent}>{item.content}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <ReportModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={loadReports}
        selectedDate={selectedDate}
      />

      <ReportDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        report={selectedReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8F8",
  },
  sliderWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  slider: {
    paddingHorizontal: 16,
  },
  dayWrapper: {
    width: ITEM_WIDTH,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dayLabelActive: {
    color: "#111827",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: {
    backgroundColor: "#111827",
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  dayNumberActive: {
    color: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  todayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  reportTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  reportContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
