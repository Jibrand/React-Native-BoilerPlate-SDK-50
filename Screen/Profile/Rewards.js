import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { useMedicines } from '../MedicineContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const RewardsScreen = () => {
  const { t } = useMedicines();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loyalty Card */}
        <LinearGradient
          colors={['#7A7A7A', '#A1A1A1', '#D4D4D4']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.pointsCard}
        >
          <Text style={styles.pointsLabel}>{t('loyaltyPoints')}</Text>
          <Text style={styles.pointsValue}>0</Text>
        </LinearGradient>

        {/* BLURRED SECTION WRAPPER */}
        <View style={{ position: 'relative' }}>
          <View>


            {/* Rewards title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('rewards')}</Text>
              <Text style={styles.seeMore}>
                {t('seeMore')} ›
              </Text>
            </View>

            {/* Reward cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rewardCardsRow}
            >
              <View style={styles.rewardCardSmall}>
                {/* <Image
                source={require('../../assets/edu1.png')}
                style={styles.rewardImage}
                /> */}
                <Text style={styles.rewardCardText}>
                  {/* Endométriose & diagnostic */}
                </Text>
              </View>

              <View style={styles.rewardCardSmall}>
                {/* <Image
                source={require('../../assets/edu2.png')}
                style={styles.rewardImage}
                /> */}
                <Text style={styles.rewardCardText}>
                  {/* Comprendre l’endométriose */}
                </Text>
              </View>

              <View style={styles.rewardCardSmall}>
                {/* <Image
                source={require('../../assets/edu1.png')}
                style={styles.rewardImage}
                /> */}
                <Text style={styles.rewardCardText}>
                  {/* Santé & prévention */}
                </Text>
              </View>
            </ScrollView>

            {/* Spacer like figma */}
            <View style={{ height: 40 }} />

            {/* Need more points */}
            <Text style={styles.needMore}>
              {t('needMorePoints')}
            </Text>

            {/* Actions */}
            <View style={styles.actionItem}>
              <View style={styles.actionLeft}>
                <Ionicons
                  name="person-add-outline"
                  size={22}
                  color="#9ca3af"
                />
                <Text style={styles.actionText}>
                  {t('referFriend')}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  200 {t('points')}
                </Text>
              </View>
            </View>

            <View style={styles.actionItem}>
              <View style={styles.actionLeft}>
                <Ionicons
                  name="location-outline"
                  size={22}
                  color="#9ca3af"
                />
                <Text style={styles.actionText}>
                  {t('visitClinic')}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  100 {t('points')}
                </Text>
              </View>
            </View>


            {/* COMING SOON OVERLAY WITH BLUR */}
            <BlurView intensity={80} tint="light" style={styles.comingSoonOverlay}>
              <View style={styles.comingSoonBadge}>
                <Ionicons name="lock-closed" size={24} color="#6B7280" />
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            </BlurView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RewardsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 70, // 🔥 THIS FIXES THE HIDDEN LAST ITEM
  },


  pointsCard: {
    height: 140,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  pointsLabel: {
    fontSize: 14,
    color: '#e5e7eb',
  },

  pointsValue: {
    fontSize: 36,
    fontWeight: '600',
    color: '#fff',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  seeMore: {
    fontSize: 14,
    color: '#9ca3af',
  },

  needMore: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },

  actionItem: {

    height: 56,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,

  },

  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },

  badge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  rewardCardsRow: {
    paddingVertical: 16,
    paddingRight: 16,
  },

  rewardCardSmall: {
    width: 160,
    height: 140,
    backgroundColor: '#ebebeb',
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
    elevation: 4,
  },

  rewardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },

  rewardCardText: {
    padding: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },


  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
});
