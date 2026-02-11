import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import { MaterialIcons, FontAwesome, Feather, Entypo } from '@expo/vector-icons';
import { useMedicines } from '../MedicineContext';
import DoctorBlog from './DoctorBlog';
// import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { t } = useMedicines();

  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Header scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* HERO IMAGE */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/doctor.png')}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroWelcome}>Welcome back, Jibran</Text>
            {/* <Text style={styles.heroName}></Text> */}
          </View>
        </View>

        {/* FLOATING CARD */}
        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>Doctor Richard Haddad</Text>

          <TouchableOpacity style={styles.switchBtn}
            onPress={() => navigation.navigate('selectclinicscreen')}
          >
            <Text style={styles.switchText}>Switch</Text>
            <MaterialIcons name="account-circle" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {t('recentlyViewed')}
          </Text>

          <View style={styles.recentCard}>
            <Image
              source={require('../../assets/book.png')}
              style={styles.book}
            />

            <View style={styles.bookInfo}>
              <Text style={styles.bookAuthor}>
                {t('bookAuthor')}
              </Text>

              <Text style={styles.bookTitle}>
                {t('bookTitle')}
              </Text>

              <Text style={styles.stars}>★★★★☆</Text>
            </View>
          </View>
        </View>

        {/* Doctor Blog */}
        <DoctorBlog />

        {/* EDUCATE YOURSELF */}
        <View style={styles.educateWrapper}>
          {/* <Text style={styles.educateTitle}>
            {t('educateYourself')}
          </Text> */}

          {/* Card 1 */}
          <View style={styles.educateCard}>
            <Image
              source={require('../../assets/edu1.png')}
              style={styles.educateImage}
            />

            <View style={styles.educateText}>
              <Text style={styles.educateHeading}>
                {t('eduTitle1')}
              </Text>

              <Text style={styles.educateDesc}>
                {t('eduDesc')}
              </Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.educateCard}>
            <Image
              source={require('../../assets/edu2.png')}
              style={styles.educateImage}
            />

            <View style={styles.educateText}>
              <Text style={styles.educateHeading}>
                {t('eduTitle2')}
              </Text>

              <Text style={styles.educateDesc}>
                {t('eduDesc2')}
              </Text>
            </View>
          </View>
        </View>

        {/* MAP + CTA SECTION */}
        <View style={styles.mapSection}>
          <View style={styles.mapWrapper}>
            {/* <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              initialRegion={{
                latitude: 48.8245,
                longitude: 2.2743,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 48.8245,
                  longitude: 2.2743,
                }}
                title="Dr Richard Haddad"
                description="Clinic Location"
              />
            </MapView> */}
          </View>

          <View style={styles.mapContent}>
            <Text style={styles.mapDoctor}>
              Docteur Richard Haddad
            </Text>

            <View style={styles.infoRow}>
              <Entypo name="location-pin" size={20} color="#4b5563" />
              <Text style={styles.infoText}>
                {t('address')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="clock" size={20} color="#4b5563" />
              <Text style={styles.infoText}>
                {t('hours')}
              </Text>
            </View>

            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.callText}>
                {t('callNow')}
              </Text>
            </TouchableOpacity>

            <View style={styles.socialRow}>
              <MaterialIcons name="email" size={24} color="#6b7280" />
              <FontAwesome name="twitter" size={24} color="#6b7280" />
              <FontAwesome name="instagram" size={24} color="#6b7280" />
              <FontAwesome name="facebook" size={24} color="#6b7280" />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
    // marginBottom:300
  },

  heroContainer: {
    position: 'relative',
    width: width,
    height: 350,
    overflow: 'hidden',
  },

  heroImage: {
    width: width,
    height: 420,
    resizeMode: 'cover',
  },

  heroOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },

  heroWelcome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 2,
  },

  heroName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  doctorCard: {
    backgroundColor: '#fff',
    marginHorizontal: 6,
    marginTop: -30,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },

  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },

  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#f3f3f3e8',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    borderColor: '#EDEDED',
    borderWidth: 1,
    //     borderWidth: 1,
    borderColor: '#EDEDED',
    // elevation: 6,
    // elevation: 2,
  },

  switchText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },

  // removed unused switchArrow

  content: {
    paddingHorizontal: 16,
    paddingTop: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#262C40',
  },

  recentCard: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },

  book: {
    width: 90,
    height: 130,
    resizeMode: 'contain',
  },

  bookInfo: {
    flex: 1,
  },

  bookAuthor: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  stars: {
    fontSize: 16,
    color: '#facc15',
  },

  educateWrapper: {
    marginTop: 40,
    paddingHorizontal: 16,
  },

  educateTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },

  educateCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    borderColor: '#EDEDED',
    borderWidth: 1,
    //     borderWidth: 1,
    borderColor: '#EDEDED',
    // elevation: 6,
    //     borderWidth: 1,
    borderColor: '#EDEDED',
    // elevation: 6,
  },

  educateImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  educateText: {
    padding: 16,
  },

  educateHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },

  educateDesc: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  mapSection: {
    marginTop: 40,
    marginBottom: 40,
  },

  mapImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },

  mapContent: {
    padding: 16,
  },

  mapDoctor: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },

  callBtn: {
    marginTop: 24,
    backgroundColor: '#7c7575',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  callText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  socialRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 28,
    marginBottom: 28,
  },

  socialIcon: {
    marginHorizontal: 16,    // try 12–20
    color: '#6b7280',
  },

  // cleaned duplicate styles from previous overlay experiment
  mapWrapper: {
    height: 220,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#EDEDED',
    // elevation: 4, // Add elevation for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },


});
