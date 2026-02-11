import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AppHeaderleft = ({ title, showBack }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default AppHeaderleft;

const styles = StyleSheet.create({
  header: {
    paddingTop: 20, // approximate status bar height + spacing
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '600',
  },
});
