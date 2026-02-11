import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const TreatmentDetailScreen = ({ navigation, route }) => {
  const { title, dImage, dDescription, dDescription1, dDescription2 } = route.params; // 👈 get the title

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={22} color="#111827" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Browse</Text>

          <View style={{ width: 60 }} />
        </View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* IMAGE */}
          <Image
            source={dImage}
            style={styles.image}
          />

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.paragraph}>
              {dDescription}
            </Text>
            <Text style={styles.paragraph}>
              {dDescription1}
            </Text>
            <Text style={styles.paragraph}>
              {dDescription2}
            </Text>
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Schedule</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default TreatmentDetailScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
  },
  /* HEADER */
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F8F8',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: 60,
  },
  backText: {
    fontSize: 14,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  /* SCROLL */
  scrollContent: {
    paddingBottom: 140,
  },
  /* IMAGE */
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  /* CARD */
  card: {
    backgroundColor: '#F7F8F8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 16,
  },
  /* CTA */
  ctaWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  ctaButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#9C9C9C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
