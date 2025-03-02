import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setUser({ token });
            }
        };
        loadUser();
    }, []);

    const login = async (token) => {
        setUser({ token });
        await AsyncStorage.setItem('token', token);
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error("Error clearing token:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
