import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../backend/AuthContext';

export default function HomeScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Login');
            } else {
                setUsername('User'); // Replace with actual user data from backend if needed
            }
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: logout }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome, {username}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    text: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ff5555' },
    logoutButton: { width: '100%', backgroundColor: '#ff5555', padding: 12, borderRadius: 5, alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
