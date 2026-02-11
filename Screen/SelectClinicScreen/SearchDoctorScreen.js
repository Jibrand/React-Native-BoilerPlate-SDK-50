const ALL_RESULTS = [
  { id: '1', name: 'Dr Richard Haddad', type: 'Doctor' },
];

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SearchDoctorScreen = ({ route, navigation }) => {

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = ALL_RESULTS.filter(item => {
    const matchesText = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesType = filter === 'All' || item.type === filter;
    return matchesText && matchesType;
  });

  return (
    <View style={styles.container}>



      {/* Search */}
      <TextInput
        placeholder="Search doctor or clinic"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.result}
            onPress={() => {
              navigation.navigate({
                name: 'selectclinicscreen',
                params: { selectedDoctor: item },
                merge: true,
              });
              //   navigation.goBack();
            }}
          >
            <Text style={styles.resultText}>{item.name}</Text>
            <Text style={styles.typeText}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchDoctorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingTop: 120,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  filterActive: {
    backgroundColor: '#111827',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 24,
  },

  result: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  resultText: {
    fontSize: 14,
    color: '#111827',
  },

  typeText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
