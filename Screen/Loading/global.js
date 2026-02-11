import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
        // borderRadius:20
    },
    subtitle: {
        fontSize: 19,
        color: 'gray',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 30,
    },
});

export default GlobalStyles;
