import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameFlashing, setUsernameFlashing] = useState(false);
    const [passwordFlashing, setPasswordFlashing] = useState(false);

    const handleRegister = async () => {
        if (!username || !password) {
            if (username === '') setUsernameFlashing(true);
            if (password === '') setPasswordFlashing(true);

            setTimeout(() => {
                setUsernameFlashing(false);
                setPasswordFlashing(false);
            }, 300);

            setTimeout(() => {
                setUsernameFlashing(false);
                setPasswordFlashing(false);
            }, 600);
            return;
        }

        try {
            const response = await fetch('http://192.168.0.104:5000/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.status === 201) {
                Alert.alert("Success", data.message);
                navigation.navigate("Login");
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Unable to connect to server");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Register</Text>

            <TextInput
                style={[styles.input, usernameFlashing && styles.flashing]}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
        backgroundColor: '#ff5555',
        borderColor: '#ff5555',
    }
});
