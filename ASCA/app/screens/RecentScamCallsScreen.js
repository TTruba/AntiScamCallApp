import React, { useLayoutEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../backend/AuthContext'; // Ensure correct import path
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this is installed

export default function RecentScamCallsScreen() {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);

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
            <Text style={styles.text}>Recent Scam Calls</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff5555',
    },
});
