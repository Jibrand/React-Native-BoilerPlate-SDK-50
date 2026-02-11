import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView, FlatList, Modal, Pressable, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useMedicines } from '../MedicineContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const DAYS_RANGE = 20; // Show 20 days around today
const ITEM_WIDTH = 56;

const SUB_ICONS = {
  p1: require('../../assets/p1.png'),
  p2: require('../../assets/p2.png'),
  p3: require('../../assets/p3.png'),
};

const MedicineIcon = ({ name, color, size = 20 }) => {
  if (SUB_ICONS[name]) {
    return (
      <Image
        source={SUB_ICONS[name]}
        style={{ width: size, height: size, tintColor: color || '#fff' }}
      />
    );
  }
  return <Ionicons name={name || 'medkit'} size={size} color={color || '#fff'} />;
};

export default function AdherenceHome() {
  const navigation = useNavigation();
  const { todayLogs, loadTodayLogs, updateLogStatus, loadingLogs } = useMedicines();
  const [activeSubTab, setActiveSubTab] = React.useState('List'); // 'List' or 'Timeline'
  const today = React.useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = React.useState(today);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    await loadTodayLogs(dateStr);
    setRefreshing(false);
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      loadTodayLogs(dateStr);
    }, [selectedDate])
  );

  React.useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    loadTodayLogs(dateStr);
  }, [selectedDate]);

  // Status Modal State
  const [isStatusModalVisible, setIsStatusModalVisible] = React.useState(false);
  const [activeLogId, setActiveLogId] = React.useState(null);

  const openStatusPicker = (logId) => {
    setActiveLogId(logId);
    setIsStatusModalVisible(true);
  };

  const updateStatus = async (status) => {
    if (activeLogId) {
      await updateLogStatus(activeLogId, status);
    }
    setIsStatusModalVisible(false);
  };

  const dates = React.useMemo(() => {
    return Array.from({ length: DAYS_RANGE * 2 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i - DAYS_RANGE);
      return d;
    });
  }, [today]);

  const appointments = [
    { id: 'a1', title: 'Dental Checkup', icon: 'calendar-outline', color: '#6366F1', time: '16:30', location: 'Downtown Clinic' },
    { id: 'a2', title: 'Doctor Visit', icon: 'calendar-outline', color: '#6366F1', time: '10:00', location: 'City Hospital' },
  ];

  const takenCount = todayLogs.filter(l => l.status === 'taken').length;
  const totalCount = todayLogs.length;

  return (
    <View style={styles.container}>
      {/* FIXED HEADER ROW: Timeline and Menu icon */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[
            styles.timelinePill,
            activeSubTab === 'Timeline' && styles.activeSubTabPill
          ]}
          onPress={() => setActiveSubTab('Timeline')}
        >
          <Ionicons
            name="filter-outline"
            size={16}
            color={activeSubTab === 'Timeline' ? '#1F2937' : '#1F2937'}
            style={{ marginRight: 6 }}
          />
          <Text style={[
            styles.timelineText,
            activeSubTab === 'Timeline' && styles.activeSubTabText
          ]}>Timeline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.hamburgerCircle,
            activeSubTab === 'List' && styles.activeSubTabCircle
          ]}
          onPress={() => setActiveSubTab('List')}
        >
          <Ionicons
            name="menu-outline"
            size={24}
            color={activeSubTab === 'List' ? '#1F2937' : '#1F2937'}
          />
        </TouchableOpacity>
      </View>

      {/* FIXED DATE SLIDER (ONLY IN TIMELINE) */}
      {activeSubTab === 'Timeline' && (
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
              const isSelected = item.toDateString() === selectedDate.toDateString();
              const isToday = item.toDateString() === today.toDateString();

              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item)}
                  style={styles.dayWrapper}
                >
                  <Text style={[styles.dayLabel, isToday && { fontWeight: '700' }]}>
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
      )}

      {/* SCROLLABLE CONTENT AREA */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeSubTab === 'List' ? (
          <>
            <Text style={styles.sectionTitle}>Today's Medicines</Text>
            <View style={styles.grid}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('AdherenceMedicineList')}
                style={[styles.card, { backgroundColor: '#E4E3E4' }]}
              >
                <View style={styles.iconCircle}>
                  <Image source={require('../../assets/pill1.png')} style={styles.icon} />
                </View>
                <Text style={styles.cardTitle}>Medicine</Text>

                <View style={[styles.innerCard, { minHeight: 60 }]}>
                  {loadingLogs && !refreshing ? (
                    <View style={styles.inlineLoading}>
                      <ActivityIndicator size="small" color="#1F2937" />
                    </View>
                  ) : (
                    <>
                      {todayLogs.map(log => (
                        <View key={log.id} style={styles.innerRow}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: log.color || '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                            <MedicineIcon name={log.icon} color="#fff" size={16} />
                          </View>
                          <View style={{ marginLeft: 8, flex: 1 }}>
                            <Text style={styles.innerText}>{log.name}</Text>
                            <Text style={styles.innerInfoText}>{log.scheduledTime} - {log.status === 'taken' ? 'Taken' : 'Upcoming'}</Text>
                          </View>
                        </View>
                      ))}
                      {todayLogs.length === 0 && (
                        <Text style={[styles.innerInfoText, { padding: 10 }]}>No doses today</Text>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.85} style={[styles.card, { backgroundColor: '#E4E3E4' }]}>
                <View style={styles.iconCircle}>
                  <Image source={require('../../assets/appoinment.png')} style={styles.icon} />
                </View>
                <Text style={styles.cardTitle}>Appointments</Text>

                <View style={[styles.innerCard, { minHeight: appointments.length * 50 }]}>
                  {appointments.map(app => (
                    <View key={app.id} style={styles.innerRow}>
                      <View style={{ marginLeft: 8 }}>
                        <Text style={styles.innerText}>{app.title}</Text>
                        <Text style={styles.innerInfoText}>{app.time} - {app.location}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.timelineContent}>
            <Text style={styles.timelineSectionTitle}>Recap</Text>
            <View style={styles.recapRow}>
              <View style={styles.recapCard}>
                <View style={styles.recapIconBg}>
                  <Image source={require('../../assets/pill1.png')} style={styles.icon} />
                </View>
                <Text style={styles.recapText}>
                  <Text style={styles.recapMain}>{takenCount}</Text>/{totalCount}
                </Text>
              </View>

              <View style={styles.recapCard}>
                <View style={[styles.recapIconBg, { backgroundColor: '#F0F9FF' }]}>
                  {/* <Ionicons name="calendar" size={24} color="#38BDF8" />                  <Image source={require('../../assets/pill1.png')} style={styles.icon} />
   */}
                  <Image source={require('../../assets/appoinment.png')} style={styles.icon} />
                </View>
                <Text style={styles.recapText}>
                  <Text style={styles.recapMain}>1</Text>/1
                </Text>
              </View>
            </View>

            <Text style={styles.timelineSectionTitle}>Daily Schedule</Text>
            {loadingLogs && !refreshing ? (
              <View style={styles.inlineLoading}>
                <ActivityIndicator size="small" color="#1F2937" />
              </View>
            ) : (
              <>
                {todayLogs.map(log => (
                  <View key={log.id} style={styles.doseRowContainer}>
                    {/* Box 1: Icon */}
                    <View style={styles.doseIconBox}>
                      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: log.color || '#38BDF8', alignItems: 'center', justifyContent: 'center' }}>
                        <MedicineIcon name={log.icon} color="#fff" size={16} />
                      </View>
                    </View>

                    {/* Box 2: Info */}
                    <View style={styles.doseMiddleBox}>
                      <View>
                        <Text style={styles.doseName}>{log.name}</Text>
                        <Text style={styles.doseSub}>{log.dosage}</Text>
                      </View>
                      <Text style={styles.takeInfo}>{log.scheduledTime}</Text>
                    </View>

                    {/* Box 3: Status */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (log.status === 'taken') return;

                        const scheduled = new Date(`${log.scheduledDate}T${log.scheduledTime}`);
                        if (scheduled > new Date()) {
                          alert('You cannot mark future medications as taken.');
                          return;
                        }

                        updateLogStatus(log.id, 'taken');
                      }}
                      style={[
                        styles.doseStatusBox,
                        log.status === 'taken'
                      ]}
                    >
                      {log.status === 'taken' ? (
                        <Ionicons name="checkmark" size={24} color="#22C55E" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={24} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
                {todayLogs.length === 0 && (
                  <Text style={{ textAlign: 'center', marginTop: 20, color: '#9CA3AF' }}>No doses scheduled for today</Text>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Status Picker Modal */}
      <Modal
        visible={isStatusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsStatusModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsStatusModalVisible(false)}
        >
          <View style={styles.statusModalContentCentered}>
            <Text style={styles.modalLabel}>Update Status</Text>

            <TouchableOpacity
              style={styles.statusOption}
              onPress={() => updateStatus('taken')}
            >
              <View style={[styles.statusIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              </View>
              <Text style={styles.statusOptionText}>Completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Fixed FAB - Only show in List tab */}
      {activeSubTab === 'List' && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('addmedicine')}
        >
          <Ionicons name="add" size={26} color="#7E7E7E" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 26,
    padding: 14,
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },
  icon: {
    width: 29,
    height: 29,
    resizeMode: 'contain',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7E7E7E',
    marginBottom: 10,
  },
  innerCard: {
    // backgroundColor: '#fff',
    borderRadius: 16,
    padding: 1,
    justifyContent: 'flex-start',
  },
  innerRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  innerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  innerInfoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80, // fixed above bottom tab / screen
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E4E3E4',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 14,
  },
  timelinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    // shadow or border like Figma
    // borderWidth: 1,
    // borderColor: '#F3F4F6',
    // elevation: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
  },
  timelineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  hamburgerCircle: {
    width: 39,
    height: 39,
    borderRadius: 22,
    // borderWidth: 1.5,
    // borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  activeSubTabPill: {
    borderColor: '#1F2937',
    border: 1,
    borderWidth: 1,
  },
  activeSubTabText: {
    color: '#262C40',
    border: 12,
    borderColor: '#1F2937',
  },
  activeSubTabCircle: {
    borderColor: '#1F2937',
    borderWidth: 1,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 10,
  },
  sliderWrapper: {
    backgroundColor: "#ecececff",
    paddingVertical: 14,
    marginBottom: 24,
  },
  slider: {
    paddingHorizontal: 10,
  },
  dayWrapper: {
    width: 60,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayCircleActive: {
    backgroundColor: "#000",
    borderColor: '#000',
  },
  dayNumber: {
    fontSize: 15,
    color: "#000",
    fontWeight: '500',
  },
  dayNumberActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  timelineSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  recapRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  recapCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  recapIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapText: {
    fontSize: 24,
    marginLeft: 12,
    color: '#111827',
    fontWeight: '700',
  },
  recapMain: {
    fontSize: 24,
    color: '#9CA3AF',

    fontWeight: '600',
  },
  doseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  doseIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  doseSub: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  takeInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusModalContentCentered: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  /* NEW 3-BOX LAYOUT STYLES */
  doseRowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 16,
    height: 64, // fixed height for uniformity
  },
  doseIconBox: {
    width: 64,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseMiddleBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  doseStatusBox: {
    width: 64,
    backgroundColor: '#fff',
    // borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  doseSub: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  takeInfo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },

  /* NEW 3-BOX LAYOUT STYLES */
  doseRowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
    marginBottom: 12,
  },
  doseIconBox: {
    width: 46,
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 5,
  },
  doseMiddleBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,

  },
  doseStatusBox: {
    width: 46,
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 10,
    // borderWidth: 1.5,
    // borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineLoading: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
