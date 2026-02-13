import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  ScrollView,
  Platform,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMedicines } from '../MedicineContext';
import { api } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MedSchedule({ navigation, route }) {
  const { addMedicine, loadMedicines } = useMedicines();
  const { medicine } = route.params;

  const [frequency, setFrequency] = useState('Every day');
  const [days, setDays] = useState({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true
  });

  const [timesPerDay, setTimesPerDay] = useState(2);
  const [times, setTimes] = useState(['08:00 AM', '08:00 PM']); // initial 2 times

  const [pillsLeft, setPillsLeft] = useState(3);
  const [pillsModalVisible, setPillsModalVisible] = useState(false);
  const [tempPills, setTempPills] = useState('3');
  const [refillReminder, setRefillReminder] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [freqModalVisible, setFreqModalVisible] = useState(false);
  const [timesModalVisible, setTimesModalVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const { t } = useMedicines();

  // Toggle day selection
  const toggleDay = (day) => {
    setDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const saveFrequency = () => {
    const selectedDays = Object.keys(days).filter(d => days[d]);
    setFrequency(selectedDays.length === 7 ? 'Every day' : selectedDays.join(', '));
    setFreqModalVisible(false);
  };

  // Update number of times per day
  const updateTimesPerDay = (num) => {
    setTimesPerDay(num);
    setTimes(prev => {
      const newTimes = [...prev];
      while (newTimes.length < num) newTimes.push('08:00 AM'); // default time
      while (newTimes.length > num) newTimes.pop();
      return newTimes;
    });
  };

  const openTimePicker = (index) => {
    const timeStr = times[index];
    const [timePart, period] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, parseInt(minutes), 0, 0);

    setCurrentDate(date);
    setEditingIndex(index);
    setTimePickerVisible(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    const isAndroid = Platform.OS === 'android';
    if (isAndroid) setTimePickerVisible(false);

    if (selectedDate) {
      setCurrentDate(selectedDate);
      let hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const timeStr = `${hours}:${minutes} ${ampm}`;

      setTimes(prev => {
        const next = [...prev];
        next[editingIndex] = timeStr;
        return next;
      });
    }

    if (!isAndroid) setTimePickerVisible(false);
  };

  const saveMedicine = async () => {
    setLoading(true);
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) return;
      const userData = JSON.parse(userDataStr);

      const selectedDays = Object.keys(days).filter(d => days[d]);

      // Convert times to 24h format for backend
      const formattedTimes = times.map(t => {
        const [timePart, period] = t.split(' ');
        let [hours, minutes] = timePart.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      });

      const payload = {
        patientId: userData.id,
        name: medicine.name,
        dosage: `${medicine.dosage} ${medicine.unit}`,
        frequency: selectedDays,
        timesPerDay,
        scheduledTimes: formattedTimes,
        icon: medicine.icon,
        color: medicine.color,
        refillReminder,
        stock: pillsLeft
      };

      const response = await api.post('/medications', payload);

      if (response.success) {
        addMedicine(response.data);
        setShowSuccess(true);
      } else {
        alert(response.message || 'Failed to save medicine');
      }
    } catch (error) {
      console.error('Error saving medicine:', error);
      alert('Could not save medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    navigation.navigate('addmedicine');
  };

  const handleOK = () => {
    setShowSuccess(false);
    navigation.navigate('AdherenceMedicineList');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={18} />
          <Text style={styles.backText}>{t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('adherence')}</Text>
        <View style={styles.headerIcon}>
          <Image
            source={require('../../assets/pill1.png')}
            style={styles.headerIcon}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitleFigma}>Schedule</Text>

        {/* FREQUENCY */}
        <TouchableOpacity style={styles.figmaCard} onPress={() => setFreqModalVisible(true)}>
          <Text style={styles.figmaCardLabel}>Frequency</Text>
          <View style={styles.figmaCardValueRow}>
            <Text style={styles.figmaCardValue}>{frequency}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* TIMES PER DAY */}
        <Text style={styles.subLabelFigma}>How many times a day ?</Text>
        <TouchableOpacity style={styles.figmaCard} onPress={() => setTimesModalVisible(true)}>
          <Text style={styles.figmaCardValue}>
            {timesPerDay} {timesPerDay === 1 ? t('timePerDay') : t('timesPerDay')}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* TIMES */}
        <Text style={styles.subLabelFigma}>What time ?</Text>
        {times.map((time, i) => (
          <TouchableOpacity key={i} style={styles.figmaCard} onPress={() => openTimePicker(i)}>
            <Text style={styles.figmaCardValue}>{time}</Text>
            <Ionicons name="time-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* REFILL */}
        <Text style={styles.subLabelFigma}>{t('refillReminder')}</Text>
        <TouchableOpacity
          style={styles.figmaCard}
          onPress={() => {
            setTempPills(pillsLeft.toString());
            setPillsModalVisible(true);
          }}
        >
          <Text style={styles.figmaCardLabel}>{t('pillsLeft')}</Text>
          <View style={styles.figmaCardValueRow}>
            <Text style={styles.figmaCardValue}>{pillsLeft}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
        <View style={styles.figmaCard}>
          <Text style={styles.figmaCardLabel}>{t('reminder')}</Text>
          <View style={styles.figmaCardValueRow}>
            <Text style={styles.figmaCardValue}>{pillsLeft} Pills before I run out</Text>
            <Switch
              value={refillReminder}
              onValueChange={setRefillReminder}
              trackColor={{ true: '#34d399' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.figmaNextBtn, loading && styles.disabledBtn]}
          onPress={saveMedicine}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.figmaNextText}>{t('next')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* NATIVE TIME PICKER */}
      {timePickerVisible && (
        <DateTimePicker
          value={currentDate}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* TIMES PER DAY MODAL */}
      <Modal visible={timesModalVisible} transparent animationType="fade">
        <View
          style={styles.modalBg}
        >
          <View style={styles.modalCardCompact}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitleLarge}>{t('selectTimesPerDay')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.premiumListItem,
                    timesPerDay === num && styles.premiumListItemActive
                  ]}
                  onPress={() => {
                    updateTimesPerDay(num);
                    setTimesModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.premiumListText,
                    timesPerDay === num && styles.premiumListTextActive
                  ]}>
                    {num} {num === 1 ? t('timePerDay') : t('timesPerDay')}
                  </Text>
                  {timesPerDay === num && (
                    <View style={styles.checkCircleSmall}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setTimesModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PILLS SELECTION MODAL */}
      <Modal visible={pillsModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.minimalModalCard}>
            <Text style={styles.minimalModalTitle}>{t('pillsLeft')}</Text>

            <TextInput
              style={styles.minimalNumericInput}
              value={tempPills}
              onChangeText={setTempPills}
              keyboardType="numeric"
              autoFocus={true}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.minimalModalActions}>
              <TouchableOpacity
                style={styles.minimalCancelBtn}
                onPress={() => setPillsModalVisible(false)}
              >
                <Text style={styles.minimalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.minimalSaveBtn}
                onPress={() => {
                  setPillsLeft(parseInt(tempPills) || 0);
                  setPillsModalVisible(false);
                }}
              >
                <Text style={styles.minimalSaveText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FREQUENCY MODAL (CENTERED) */}
      <Modal visible={freqModalVisible} transparent animationType="fade">
        <View
          style={styles.modalBg}
        >
          <View style={styles.modalCardCompact}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitleLarge}>Select Days</Text>
            </View>

            <ScrollView
              style={{ flexShrink: 1 }}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {Object.keys(days).map(day => (
                <View key={day} style={styles.premiumListItem}>
                  <Text style={styles.premiumListText}>{day}</Text>
                  <Switch
                    value={days[day]}
                    onValueChange={() => toggleDay(day)}
                    trackColor={{ true: '#34d399' }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.figmaNextBtn, { marginTop: 10 }]}
              onPress={saveFrequency}
            >
              <Text style={styles.figmaNextText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* SUCCESS MODAL */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.successModalCard}>
            <Text style={styles.successTitle}>
              {medicine.name} added successfully
            </Text>

            <View style={styles.successCheckContainer}>
              <View style={styles.successCheckCircle}>
                <Ionicons name="checkmark" size={48} color="#000" />
              </View>
            </View>

            <View style={styles.successActionRow}>
              <TouchableOpacity style={styles.addAnotherBtn} onPress={handleAddAnother}>
                <Text style={styles.addAnotherText}>Add another</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okBtn} onPress={handleOK}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' }, // Light gray background like Figma

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  back: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: '#6B7280' },

  successText: { fontSize: 16, marginBottom: 16 },

  headerIcon: {
    width: 22,
    height: 22,
    // borderRadius: 16,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { padding: 20 },

  /* FIGMA STYLES */
  sectionTitleFigma: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    marginTop: 10,
  },
  subLabelFigma: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  figmaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  figmaCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  figmaCardValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  figmaCardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  figmaNextBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    // shadow
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  figmaNextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  disabledBtn: {
    opacity: 0.7,
  },

  /* MODALS FOR OTHERS */
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCardCompact: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 14,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalHandle: {
    display: 'none',
  },
  modalTitleLarge: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  modalScrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  premiumListItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  premiumListItemActive: {
    backgroundColor: '#F0FDF4',
  },
  premiumListText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '600',
  },
  premiumListTextActive: {
    color: '#166534',
    fontWeight: '700',
  },
  checkCircleSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },

  modalCard: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  modalDay: { fontSize: 14, fontWeight: '600', color: '#374151' },
  modalSaveBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 16, marginTop: 12 },
  modalSaveText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },

  successModalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 30,
  },
  successCheckContainer: {
    marginVertical: 10,
    marginBottom: 40,
  },
  successCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successActionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  addAnotherBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addAnotherText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  okBtn: {
    flex: 1,
    backgroundColor: '#38BDF8',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  okText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  minimalModalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  minimalModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  minimalNumericInput: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  minimalModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  minimalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  minimalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  minimalSaveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
  },
  minimalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
