import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

const Blogs = () => {
    return (
        <View style={styles.educateWrapper}>
            {/* Card 1 */}
            <View style={styles.educateCard}>
                <Image
                    source={require('../../assets/edu1.png')}
                    style={styles.educateImage}
                />

                <View style={styles.educateText}>
                    <Text style={styles.educateHeading}>
                        Endométriose et test Endotest® pour un diagnostic rapide.
                    </Text>

                    <Text style={styles.educateDesc}>
                        L’endométriose cause de fortes douleurs, surtout pendant les règles.
                        Le test Endotest® aide à poser un diagnostic plus rapide et à mieux
                        prendre en charge la maladie.
                    </Text>
                </View>
            </View>

            {/* Card 2 */}
            <View style={styles.educateCard}>
                <Image
                    source={require('../../assets/edu3.png')}
                    style={styles.educateImage}
                />

                <View style={styles.educateText}>
                    <Text style={styles.educateHeading}>
                        Comprendre la maladie de l’endométriose.
                    </Text>

                    <Text style={styles.educateDesc}>
                        L’endométriose cause de fortes douleurs, surtout pendant les règles.
                        Le test Endotest® aide à poser un diagnostic plus rapide et à mieux
                        prendre en charge la maladie.
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Blogs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8F8',
        // marginBottom:300
    },


    educateWrapper: {
        marginTop: 4,
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


});
