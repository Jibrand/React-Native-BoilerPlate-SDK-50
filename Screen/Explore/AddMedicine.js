import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useMedicines } from '../MedicineContext';

/* Fake French medicines */
const MEDICINES_FR = [
  'Doliprane',
  'Efferalgan',
  'Dafalgan',
  'Spasfon',
  'Nurofen',
  'Ventoline',
  'Smecta',
  'Gaviscon',
];

/* Units */
const UNITS = ['mg', 'ml', 'pill'];

const ICONS = [
  'medkit',              // medical kit (first one)
  'bandage',             // treatment / medicine
  'fitness',             // health / dosage
  'heart',               // health related
  'flask',               // liquid medicine / syrup
];
const SUB_ICONS = {
  p1: require('../../assets/p1.png'),
  p2: require('../../assets/p2.png'),
  p3: require('../../assets/p3.png'),
}
const COLORS = [
  '#34d399', // green
  '#ef4444', // red
  '#22c55e', // neon green
  '#3b82f6', // blue
  '#ec4899', // pink
  '#a3a3a3', // gray
  '#facc15', // yellow
];

export default function MedInfo({ navigation }) {
  const [query, setQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);

  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');

  const [icon, setIcon] = useState(ICONS[0]);
  const [subIcon, setSubIcon] = useState(null);
  const [color, setColor] = useState(COLORS[0]);

  const { t } = useMedicines();

  useFocusEffect(
    useCallback(() => {
      // RESET FORM WHEN SCREEN OPENS
      setQuery('');
      setSelectedMed(null);
      setDosage('');
      setUnit('mg');
      setIcon(ICONS[0]);
      setSubIcon(null);
      setColor(COLORS[0]);
    }, [])
  );


  /* Autocomplete */
  const filtered = useMemo(() => {
    if (!query || selectedMed) return [];
    return MEDICINES_FR.filter(m =>
      m.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, selectedMed]);

  const selectMedicine = name => {
    setQuery(name);
    setSelectedMed(name);
  };

  const canProceed =
    selectedMed && dosage.length > 0 && Number(dosage) > 0;

  const goNext = () => {
    navigation.navigate('MedSchedule', {
      medicine: {
        name: selectedMed,
        dosage: Number(dosage),
        unit,
        icon: subIcon || icon,
        color,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={18} />
          <Text style={styles.backText}>
            {t('back')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {t('adherence')}
        </Text>

        <View style={styles.headerIcon}>
          <Image
            source={require('../../assets/pill1.png')}
            style={styles.headerIcon}
          />
        </View>
      </View>


      <View style={styles.divider} />

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {t('medInfo')}
        </Text>

        {/* MEDICINE INPUT */}
        <View style={styles.card}>
          <Ionicons name="clipboard-outline" size={18} />
          <TextInput
            value={query}
            onChangeText={t => {
              setQuery(t);
              setSelectedMed(null);
            }}
            placeholder={t('medicine')}
            style={styles.input}
          />
        </View>

        {/* AUTOCOMPLETE */}
        {filtered.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filtered}
              keyExtractor={i => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectMedicine(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* EXTRA FIELDS */}
        {selectedMed && (
          <>
            {/* DOSAGE */}
            <View style={styles.card}>
              <Ionicons name="calculator-outline" size={18} />
              <TextInput
                value={dosage}
                onChangeText={setDosage}
                placeholder={t('dosage')}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            {/* UNIT */}
            <TouchableOpacity style={styles.card}>
              <Text style={styles.unitLabel}>
                {t('unit')}
              </Text>
              <View style={styles.unitRight}>
                <Text>{unit}</Text>
                <Ionicons name="chevron-forward" size={18} />
              </View>
            </TouchableOpacity>

            {/* APPEARANCE */}
            <Text style={styles.sectionTitle}>
              {t('appearance')}
            </Text>

            {/* ICONS */}
            <View style={styles.row}>
              {ICONS.map(i => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.iconPick,
                    icon === i && styles.activePick,
                  ]}
                  onPress={() => {
                    setIcon(i);
                    if (i !== ICONS[0]) setSubIcon(null);
                  }}
                >
                  <Ionicons name={i} size={18} />
                </TouchableOpacity>
              ))}
            </View>

            {/* SUB ICONS - Only if first is selected */}
            {icon === ICONS[0] && (
              <View style={styles.row}>
                {Object.keys(SUB_ICONS).map(key => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.iconPick,
                      subIcon === key && styles.activeSubPick,
                    ]}
                    onPress={() => setSubIcon(key)}
                  >
                    <Image
                      source={SUB_ICONS[key]}
                      style={styles.subIconImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}



            {/* COLORS */}
            <View style={styles.row}>
              {COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorPick,
                    { backgroundColor: c },
                    color === c && styles.activeColor,
                  ]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            {/* NEXT */}
            <TouchableOpacity
              style={[
                styles.okButton,
                !canProceed && { opacity: 0.5 },
              ]}
              disabled={!canProceed}
              onPress={goNext}
            >
              <Text style={styles.okText}>
                {t('ok')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F8' },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 6, fontSize: 12, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '600' },

  headerIcon: {
    width: 22,
    height: 22,
    // borderRadius: 16,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },


  divider: { height: 1, backgroundColor: '#e5e7eb' },

  content: { padding: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
  },

  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  unitLabel: { flex: 1, fontWeight: '500' },

  unitRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 14,
    justifyContent: "center"
  },

  iconPick: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  activePick: {
    backgroundColor: '#bfdbfe',
  },
  activeSubPick: {
    backgroundColor: '#bfdbfe',
  },

  colorPick: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },

  activeColor: {
    borderWidth: 2,
    borderColor: '#111827',
  },

  okButton: {
    backgroundColor: '#22B9FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  okText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffffff',
  },
  subIconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
