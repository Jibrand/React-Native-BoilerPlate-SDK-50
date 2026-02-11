import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AppHeader = ({ title, showBack }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* LEFT */}
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            {/* <Ionicons name="arrow-back" size={22} color="#111827" /> */}
            <Image
              source={require('../assets/back.png')}
              style={styles.backIcon}
            />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>

      {/* CENTER */}

      {/* RIGHT */}
      <View style={styles.right}>
        {/* <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={22} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="bag-outline" size={22} color="#111827" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  left: {
    width: 90,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  right: {
    width: 90,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 14,
  },

  iconBtn: {
    padding: 4,
  },
  backIcon: {
    marginTop: 1,
    width: 7,
    height: 10,
  },
});
