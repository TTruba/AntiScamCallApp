import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../backend/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate("Login");
            } else {
                setUsername('John Doe'); // Replace with actual user data
                setEmail('johndoe@example.com'); // Replace with actual email
            }
        };
        fetchUserData();
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
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.avatar} />
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="edit" size={24} color="#ff5555" />
                    <Text style={styles.menuText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="security" size={24} color="#ff5555" />
                    <Text style={styles.menuText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: '#121212', paddingTop: 40 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    username: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    email: { fontSize: 16, color: '#aaa', marginBottom: 20 },
    menuContainer: { width: '90%' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
    menuText: { fontSize: 18, color: '#fff', marginLeft: 15 },
});

