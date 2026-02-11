import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import ConsultantTab from './ConsultantTab';
import AdherenceTab from './AdherenceTab';
import { useMedicines } from '../MedicineContext';
import { useNavigation } from '@react-navigation/native';
import AppHeaderleft from '../../components/AppHeaderleft';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const [activeTab, setActiveTab] = useState('Browse');

  return (
    <View style={{ flex: 1, backgroundColor: '#ffff' }}>
      <AppHeaderleft title="Clinic" />

      {/* TOP TABS */}
      <View style={styles.tabsRow}>
        {['Browse', 'Adherence', 'Consultant'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT AREA */}
      <View style={{ flex: 1, backgroundColor: '#F7F8F8' }}>
        {activeTab === 'Browse' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <TreatmentsTab />
          </ScrollView>
        )}

        {activeTab === 'Adherence' && (
          <AdherenceTab />
        )}

        {activeTab === 'Consultant' && (
          <ConsultantTab />   // ❌ NO parent ScrollView
        )}
      </View>
    </View>

  );
}

export default ExploreScreen;

const TreatmentsTab = () => {
  const { t } = useMedicines();
  const navigation = useNavigation(); // 👈 get navigation instance

  const cardColumns = [
    // Column 1
    [
      { id: '1', title: 'Obesity', image: require('../../assets/m1.png'), dImage: require('../../assets/d4.png'), dDescription: 'L’obésité, défi majeur de santé publique, ne se résume pas uniquement à une question d’excèsalimentaire ou de manque d’activité physique. Les recherches actuelles démontrent clairementque la santé intestinale joue également un rôle crucial dans le contrôle du poids corporel. Ladysbiose intestinale perturbe la régulation de l’appétit, le stockage des graisses et provoque uneinflammation chronique, favorisant ainsi le gain de poids et les difficultés à en perdre.Chez Médecine Intégrale, nous proposons une approche globale, basée sur la nutrition ciblée,le rééquilibrage du microbiote et une gestion personnalisée de l’inflammation pour une perte depoids saine et durable.Parce que la santé globale commence par un intestin en équilibre.', dDescription1: '', dDescription2: '' },
    ],
    // Column 2
    [
      { id: '3', title: 'Diabetes', image: require('../../assets/m3.png'), dImage: require('../../assets/d6.png'), dDescription: 'Description', dDescription1: 'Description', dDescription2: 'Description' },
    ],
    // Column 3
    [
      { id: '5', title: 'Cardiovascular', image: require('../../assets/m5.png'), dImage: require('../../assets/d2.png'), dDescription: 'Description', dDescription1: 'Description', dDescription2: 'Description' },
    ],
    // Column 4
    [
      { id: '6', title: 'Neuropsych', image: require('../../assets/m6.png'), dImage: require('../../assets/d5.png'), dDescription: 'Description', dDescription1: 'Description', dDescription2: 'Description' },
    ],
  ];

  const cardColumns1 = [
    // Column 1
    [
      { id: '2', title: 'Endometriosis', image: require('../../assets/m2.png'), dImage: require('../../assets/d1.png'), dDescription: 'L’endométriose ne se limite pas à une maladie gynécologique. De la dysbiose intestinale à l’inflammation chronique, une nouvelle vision s’impose pour mieux diagnostiquer et traiter cette pathologie qui touche 1 femme sur 10.', dDescription1: 'Longtemps considérée comme une affection exclusivement gynécologique (règles douloureuses, infertilité, kystes ovariens), l’endométriose est aujourd’hui reconnue comme une maladie inflammatoire chronique et systémique.', dDescription2: 'Des chercheurs comme le Dr Richard Haddad, spécialiste du microbiote intestinal et de la santé féminine, révèlent que le rôle du système digestif – et en particulier du microbiote – est fondamental dans le développement de cette pathologie. Cette approche globale ouvre la voie à des traitements naturels et personnalisés' },
    ],
    // Column 2
    [
      { id: '4', title: 'Abdominal pain', image: require('../../assets/m4.png'), dImage: require('../../assets/d3.png'), dDescription: 'Description', dDescription1: 'Description', dDescription2: 'Description' },
    ],

  ];


  return (
    <View style={{ paddingHorizontal: 16 }}>
      {/* PROMO CARD */}
      <LinearGradient
        colors={['#6B6B6B', '#999999', '#BCBCBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.promoCard}
      >
        <Text style={styles.promoTitle}>
          Treat today. Get better. Earn{"\n"}rewards.
        </Text>

        <Text style={styles.promoSub}>
          Treatments and exclusive rewards
        </Text>

        <TouchableOpacity style={styles.promoBtn}>
          <Text style={styles.promoBtnText}>
            How does it work ?
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* CATEGORIES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 1, gap: 6 }}
      >
        {cardColumns.map((column, index) => (
          <View key={index} style={{ flexDirection: 'column', gap: 12 }}>
            {column.map((card, i) => (
              <View key={i} style={styles.categoryCard}>
                <TouchableOpacity
                  key={i}
                  style={styles.categoryCard}
                  onPress={() => {
                    navigation.navigate('detailsscreen', {
                      title: card.title,
                      dImage: card.dImage,
                      dDescription: card.dDescription,
                      dDescription1: card.dDescription1,
                      dDescription2: card.dDescription2,
                    });
                  }}

                >
                  <View style={styles.imageHolder}>
                    <Image
                      source={card.image}
                      style={styles.categoryImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.categoryText}>{card.title}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* CATEGORIES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 1, gap: 6 }}
      >
        {cardColumns1.map((column, index) => (
          <View key={index} style={{ flexDirection: 'column', gap: 12, marginTop: 6 }}>
            {column.map((card, i) => (
              <View key={i} style={styles.categoryCard}>
                <TouchableOpacity
                  key={i}
                  style={styles.categoryCard}
                  onPress={() => {
                    navigation.navigate('detailsscreen', {
                      title: card.title,
                      dImage: card.dImage,
                      dDescription: card.dDescription,
                      dDescription1: card.dDescription1,
                      dDescription2: card.dDescription2,
                    });
                  }}

                >
                  <View style={styles.imageHolder}>
                    <Image
                      source={card.image}
                      style={styles.categoryImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.categoryText}>{card.title}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
  },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
  },

  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },

  /* Content */
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120, // footer space

  },

  promoCard: {
    height: 190,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',  // keeps content vertically centered
    alignItems: 'center',      // 🔥 centers title + subtitle + button
    marginVertical: 24,
    overflow: 'hidden',
  },

  // promoImage: {
  //   width: '100%',
  //   height: '100%',
  //   borderRadius: 24,
  //   marginTop: 70
  // },



  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
  },

  promoSub: {
    fontSize: 1,
    color: '#fff',
    marginTop: 10,
    opacity: 0.9,
  },

  promoBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
  },


  promoBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },

  /* Categories */
  categories: {
    paddingRight: 16,
  },

  categoryBox: {
    width: 120,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',

    gap: 8,
  },

  categoryActive: {
    borderWidth: 1.5,
    borderColor: '#111827',
  },

  categoryText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },

  categoryTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  boxScroll: {
    paddingRight: 16,
  },

  boxWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 220,              // 🔥 REQUIRED for 2 rows
    width: 380,               // controls how many per column
  },

  categoryBox: {
    width: 120,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 14,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  categoryText: {
    fontSize: 13,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },

  treatmentScroll: {
    paddingTop: 16,
    paddingRight: 16,
  },

  treatmentCard: {
    width: 140,
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 3,
  },

  treatmentActive: {
    borderWidth: 2,
    borderColor: '#111827', // active outline like figma
  },

  treatmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },

  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },


  tabItem: {
    paddingVertical: 14,
    alignItems: 'center',
    flex: 1,
  },

  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9ca3af',
  },

  tabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },

  tabIndicator: {
    marginTop: 8,
    height: 3,
    width: 24,
    borderRadius: 2,
    backgroundColor: '#111827',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },

  tabText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },

  tabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },

  tabUnderline: {
    marginTop: 6,
    height: 2,
    width: '100%',
    backgroundColor: '#111827',
  },

  promoCard: {
    height: 190,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center', // ✅ centers everything
    marginVertical: 24,
    overflow: 'hidden',
  },

  promoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },

  promoSub: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.8,
    marginBottom: 15,
  },

  promoBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: 'center', // ✅ THIS NOW WORKS
  },

  promoBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },


  horizontalGrid: {
    paddingRight: 16,
  },

  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 320,          // controls how many cards per swipe
    height: 230,         // REQUIRED for 2 rows
  },

  categoryCard: {
    width: 120,              // ⬅️ slightly smaller
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 4,
    marginBottom: 4,
    position: 'relative',
    // elevation: 2,
    borderColor: '#e5e7eb',
    // borderWidth: 1,
  },

  categoryActive: {
    borderWidth: 2,
    borderColor: '#111827',
  },

  imageHolder: {
    height: 50,              // ⬅️ reserved space for image
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  categoryImage: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },

  categoryText: {
    position: 'absolute',
    bottom: 10,              // ⬅️ text locked to bottom
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },


});
