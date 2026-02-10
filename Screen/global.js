import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Use dark background for better contrast
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Use dark background for better contrast
        // paddingTop:"300px"
    },
    image: {
        width: 230,
        height: 150,
        resizeMode: 'contain',
    },
    image2: {
        marginBottom:-20,
        width: 200,
        height: 150,
        resizeMode: 'contain',
    },
    image3: {
        marginTop:-60,
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    animation: {
        marginTop: 10,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#373636', // Light text for better readability on dark background
        marginTop: 20,
    },
    description: {
        fontSize: 15,
        color: '#666565', // Lighter text for better readability
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#7eb900', // Consistent with your theme color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GlobalStyles;
