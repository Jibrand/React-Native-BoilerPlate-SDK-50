import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ scrollY }) => {
  const y = scrollY || new Animated.Value(0);

  const logoScale = y.interpolate({
    inputRange: [0, 500],
    outputRange: [1.25, 1.0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.header}>
      <Animated.Image
        source={require('../assets/zayna.png')}
        style={[styles.logo]}
      />

      <View style={styles.icons}>
        {/* <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={22} color="#1f2937" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="bag-outline" size={22} color="#1f2937" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  logo: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
    // borderRadius: 5
  },
  icons: {
    flexDirection: 'row',
    gap: 9,
  },
  iconBtn: {
    padding: 6,
  },
});
