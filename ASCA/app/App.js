import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthProvider, AuthContext } from '../backend/AuthContext';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecentScamCallsScreen from './screens/RecentScamCallsScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TabStack = createStackNavigator();

// 🔹 Logout Function
const handleLogout = async (logout, navigation) => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
            text: "Yes", onPress: async () => {
                try {
                    await AsyncStorage.removeItem("token");
                    logout();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                    });
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            }
        }
    ]);
};

// 🔹 Bottom Tab Navigator (Includes My Profile & App Settings)
function BottomTabs({ navigation }) {
    const { logout } = useContext(AuthContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarActiveTintColor: '#ff5555',
                tabBarInactiveTintColor: '#ddd',
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Recent Scam Calls') {
                        iconName = 'warning';
                    } else if (route.name === 'My Profile') {
                        iconName = 'person';
                    } else if (route.name === 'App Settings') {
                        iconName = 'settings';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                headerRight: () => (
                    <Button title="Logout" onPress={() => handleLogout(logout, navigation)} color="#ff5555" />
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Recent Scam Calls" component={RecentScamCallsScreen} />
            <Tab.Screen name="App Settings" component={SettingsScreen} />
            <Tab.Screen name="My Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

// 🔹 Wrap Bottom Tabs inside Stack Navigator
function AppTabs() {
    return (
        <TabStack.Navigator>
            <TabStack.Screen
                name="Tabs"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <TabStack.Screen name="Login" component={LoginScreen} />
        </TabStack.Navigator>
    );
}

// 🔹 Stack Navigator
function AppNavigator() {
    const { user } = useContext(AuthContext);

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
            {user ? (
                <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

// 🔹 Main App Component
export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
