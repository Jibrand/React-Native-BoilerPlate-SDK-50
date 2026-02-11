import React from 'react'
import { ScrollView, Linking, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useMedicines } from '../MedicineContext';

const DoctorBlog = () => {
  const { t } = useMedicines();

  const books = [
    {
      id: '1',
      image: require('../../assets/book1.png'),
      link: 'https://www.amazon.com/',
    },
    {
      id: '2',
      image: require('../../assets/book2.png'),
      link: 'https://www.amazon.com/',
    },
    {
      id: '3',
      image: require('../../assets/book3.png'),
      link: 'https://www.amazon.com/',
    },
  ];

  return (
    <>
      <View style={styles.content}>

        <Text style={styles.educateTitle}>
          {t('educateYourself')}
        </Text>
        {/* EDUCATE YOURSELF */}
        <View style={styles.educateCard}>
          <Image
            source={require('../../assets/DoctorBlog.png')}
            style={styles.educateImage}
          />

          <View style={styles.educateText}>
            <Text style={styles.educateHeading}>
              About DR Richard Haddad
            </Text>

            <Text style={styles.educateDesc}>
              About DR Richard Haddad About DR Richard Haddad About DR Richard Haddad About DR Richard Haddad About DR Richard Haddad
            </Text>
          </View>
        </View>

        {/* DISCOVER */}
        <View style={styles.discoverWrapper}>
          <Text style={styles.discoverTitle}>Discover</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
          >
            {books.map(book => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => Linking.openURL(book.link)}
                activeOpacity={0.85}
              >
                <Image source={book.image} style={styles.bookImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>


      </View>
    </>

  )
}

export default DoctorBlog

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginBottom:300
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
    borderWidth: 1,
    borderColor: '#EDEDED',
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

  /* DISCOVER */

  discoverWrapper: {
    marginTop: 40,
  },

  discoverTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 16,
    color: '#1f2937',
  },

  bookCard: {
    width: 110,
    height: 90,
    marginRight: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDEDED',
    // elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10

  },

  bookImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },

})
