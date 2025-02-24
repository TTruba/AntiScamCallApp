import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../backend/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameFlashing, setUsernameFlashing] = useState(false);
    const [passwordFlashing, setPasswordFlashing] = useState(false);

    const handleLogin = async () => {
        if (username === '' || password === '') {
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
            const response = await axios.post('http://192.168.0.104:5000/login', {
                username,
                password
            });

            await AsyncStorage.setItem('token', response.data.token);
            login(response.data.token); // Updating auth context
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Login</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    text: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ff5555' },
    input: { width: '100%', height: 40, borderColor: '#555', borderWidth: 1, borderRadius: 5, marginBottom: 12, paddingLeft: 8, color: '#fff' },
    button: { width: '100%', backgroundColor: '#ff5555', padding: 12, borderRadius: 5, marginBottom: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    registerButton: { width: '100%', padding: 12, marginTop: 10, alignItems: 'center' },
    registerButtonText: { color: '#ff5555', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
    flashing: { backgroundColor: '#ff5555', borderColor: '#ff5555' }
});
