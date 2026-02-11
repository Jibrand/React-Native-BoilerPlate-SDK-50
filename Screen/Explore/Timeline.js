import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Timeline() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Timeline</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <Ionicons name="time-outline" size={80} color="#D1D5DB" />
        <Text style={styles.title}>Timeline Coming Soon</Text>
        <Text style={styles.subtitle}>Track your medicine adherence over time.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 24 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 12 },
});
