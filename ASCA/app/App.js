import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import RecentScamCallsScreen from './screens/RecentScamCallsScreen';

// Create Stack Navigator and Tab Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#121212', // Dark background for tabs
                    borderTopWidth: 0,  // Removes the top border
                    elevation: 0,       // Removes the shadow/elevation (Android)
                },
                tabBarActiveTintColor: '#ff5555', // Red-ish active tab color
                tabBarInactiveTintColor: '#ddd', // Light grey for inactive tabs
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Recent Scam Calls" component={RecentScamCallsScreen} />
        </Tab.Navigator>
    );
}

// Stack Navigator
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#121212', // Dark background for header
                        elevation: 0, // Remove the header shadow on Android
                    },
                    headerTintColor: '#ff5555', // Red-ish header text color
                    headerBackTitleVisible: false, // Hide back button title
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                {/* Wrap the Tab Navigator inside a screen */}
                <Stack.Screen name="Home" component={AppTabs} />
            </Stack.Navigator>
        </NavigationContainer>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff5555', // Red-ish text color
    },
});
