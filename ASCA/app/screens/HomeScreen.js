import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212', // Dark background
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff5555', // Red-ish text color
    },
});
