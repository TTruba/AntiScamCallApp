import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../backend/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import an icon

export default function HomeScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate("Login");
            } else {
                setUsername('User'); // Replace with actual user data from backend if needed
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Yes", onPress: async () => {
                    try {
                        await AsyncStorage.removeItem("token");
                        logout();
                        navigation.navigate("Login");
                    } catch (error) {
                        console.error("Logout failed:", error);
                    }
                }
            }
        ]);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                    <Icon name="logout" size={24} color="#ff5555" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome, {username}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    text: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ff5555' },
    logoutButton: { width: '100%', backgroundColor: '#ff5555', padding: 12, borderRadius: 5, alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
