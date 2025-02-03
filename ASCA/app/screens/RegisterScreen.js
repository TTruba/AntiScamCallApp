import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFlashing, setEmailFlashing] = useState(false);
    const [passwordFlashing, setPasswordFlashing] = useState(false);

    const handleRegister = () => {
        if (email === '' || password === '') {
            // Trigger flashing effect for missing fields
            if (email === '') setEmailFlashing(true);
            if (password === '') setPasswordFlashing(true);

            // Flash the input boxes twice (using setTimeout)
            setTimeout(() => {
                setEmailFlashing(false);
                setPasswordFlashing(false);
            }, 300); // Time for flash duration

            setTimeout(() => {
                setEmailFlashing(false);
                setPasswordFlashing(false);
            }, 600); // Time between flashes
        } else {
            // Reset the inputs after registration
            setEmail('');
            setPassword('');
            navigation.navigate('Login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Register</Text>

            <TextInput
                style={[styles.input, emailFlashing && styles.flashing]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ddd"
            />
            <TextInput
                style={[styles.input, passwordFlashing && styles.flashing]}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#ddd"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ff5555',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingLeft: 8,
        color: '#fff',
    },
    button: {
        width: '100%',
        backgroundColor: '#ff5555',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    flashing: {
        backgroundColor: '#ff5555', // Light grey flash color
        borderColor: '#ff5555', // Light grey border
    }
});
