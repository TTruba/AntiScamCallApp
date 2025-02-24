import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, AuthProvider } from '../backend/AuthContext';




// Import Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecentScamCallsScreen from './screens/RecentScamCallsScreen';

// Create Stack Navigator and Tab Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// HomeScreen with API Fetching and Logout Button
function HomeScreen() {
    const { logout } = useContext(AuthContext);
    const [message, setMessage] = useState("Fetching MariaDB...");

    useEffect(() => {
        axios.get("http://192.168.0.104:5000/") // Change to your actual API URL
            .then(response => setMessage(response.data.message))
            .catch(error => setMessage("Error fetching data"));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

// Tab Navigator
function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarActiveTintColor: '#ff5555',
                tabBarInactiveTintColor: '#ddd',
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Recent Scam Calls" component={RecentScamCallsScreen} />
        </Tab.Navigator>
    );
}

// Stack Navigator
function AppNavigator() {
    const { userToken } = useContext(AuthContext);

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                    elevation: 0,
                },
                headerTintColor: '#ff5555',
                headerBackTitleVisible: false,
            }}
        >
            {userToken ? (
                <Stack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff5555',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff5555',
        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    apiText: {
        fontSize: 16,
        marginTop: 10,
        color: '#ddd',
    },
});
