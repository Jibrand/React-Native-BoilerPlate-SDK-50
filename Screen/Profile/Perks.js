import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { useMedicines } from '../MedicineContext';
import { useNavigation } from '@react-navigation/native';

const Perks = () => {
  const { language, toggleLanguage, t } = useMedicines();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('personalinfo')}
        >
          <Text style={styles.menuText}>Add dependent</Text>
          <Text style={styles.comingSoonText}>Coming soon</Text>
          <View>

            <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Add assistant</Text>
          <Text style={styles.comingSoonText}>Coming soon</Text>
          <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
        </View>

      </View>
    </View>
  );
};

export default Perks;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  rewardsCard: {
    height: 86,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
  },

  rewardsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },

  menuItem: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  comingSoonText: {
    fontSize: 13,
    marginLeft: 60,
    fontWeight: '400',
    color: '#000000ff',
  },
});
