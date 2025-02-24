import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        // Check if user is logged in on app start
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setUserToken(token);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async (token) => {
        await AsyncStorage.setItem('token', token);
        setUserToken(token);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
