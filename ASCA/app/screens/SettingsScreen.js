import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Switch, TouchableOpacity, Alert, TextInput, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../backend/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const [notifications, setNotifications] = useState(true);
    const [blockNumber, setBlockNumber] = useState('');
    const [blockCalls, setBlockCalls] = useState(false);
    const [blockSMS, setBlockSMS] = useState(false);
    const [detectSuspiciousLinks, setDetectSuspiciousLinks] = useState(false);
    const [blockedList, setBlockedList] = useState([
        { number: "+1234567890", calls: true, sms: true },
        { number: "+1987654321", calls: true, sms: false },
        { number: "+1122334455", calls: false, sms: true },
    ]);

    useEffect(() => {
        loadBlockedNumbers();
    }, []);

    const saveBlockedNumbers = async (updatedList) => {
        try {
            await AsyncStorage.setItem('blockedNumbers', JSON.stringify(updatedList));
        } catch (error) {
            console.error('Failed to save blocked numbers:', error);
        }
    };

    const loadBlockedNumbers = async () => {
        try {
            const storedList = await AsyncStorage.getItem('blockedNumbers');
            if (storedList) {
                setBlockedList(JSON.parse(storedList));
            }
        } catch (error) {
            console.error('Failed to load blocked numbers:', error);
        }
    };

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

    const handleBlockNumber = () => {
        if (blockNumber.trim() === '') {
            Alert.alert("Error", "Please enter a valid phone number.");
            return;
        }

        const newEntry = {
            number: blockNumber,
            calls: blockCalls,
            sms: blockSMS
        };

        const updatedList = [...blockedList, newEntry];
        setBlockedList(updatedList);
        saveBlockedNumbers(updatedList);

        setBlockNumber('');
        setBlockCalls(false);
        setBlockSMS(false);
        Alert.alert("Number Blocked", `${blockNumber} has been added to the block list.`);
    };

    const handleRemoveBlockedNumber = (numberToRemove) => {
        const updatedList = blockedList.filter(item => item.number !== numberToRemove);
        setBlockedList(updatedList);
        saveBlockedNumbers(updatedList);
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
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* Notifications Toggle */}
                <View style={styles.settingItem}>
                    <Icon name="notifications" size={24} color="#ff5555" />
                    <Text style={styles.settingText}>Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={() => setNotifications(!notifications)}
                        thumbColor={notifications ? '#ff5555' : '#ddd'}
                        trackColor={{ false: '#777', true: '#ff5555' }}
                    />
                </View>

                {/* Suspicious Link Detection */}
                <View style={styles.settingItem}>
                    <Icon name="warning" size={24} color="#ff5555" />
                    <Text style={styles.settingText}>Detect Suspicious Links in SMS</Text>
                    <Switch
                        value={detectSuspiciousLinks}
                        onValueChange={() => setDetectSuspiciousLinks(!detectSuspiciousLinks)}
                        thumbColor={detectSuspiciousLinks ? '#ff5555' : '#ddd'}
                        trackColor={{ false: '#777', true: '#ff5555' }}
                    />
                </View>

                {/* Block Number Input */}
                <View style={styles.blockContainer}>
                    <Text style={styles.blockTitle}>Block Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number to block"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        value={blockNumber}
                        onChangeText={setBlockNumber}
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Block Calls</Text>
                        <Switch
                            value={blockCalls}
                            onValueChange={() => setBlockCalls(!blockCalls)}
                            thumbColor={blockCalls ? '#ff5555' : '#ddd'}
                            trackColor={{ false: '#777', true: '#ff5555' }}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Block SMS</Text>
                        <Switch
                            value={blockSMS}
                            onValueChange={() => setBlockSMS(!blockSMS)}
                            thumbColor={blockSMS ? '#ff5555' : '#ddd'}
                            trackColor={{ false: '#777', true: '#ff5555' }}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleBlockNumber}>
                        <Text style={styles.buttonText}>Add to Block List</Text>
                    </TouchableOpacity>
                </View>

                {/* Blocked Numbers List */}
                <FlatList
                    data={blockedList}
                    keyExtractor={(item) => item.number}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.blockedItem}
                            onPress={() => handleRemoveBlockedNumber(item.number)}
                        >
                            <Text style={styles.blockedText}>{item.number}</Text>
                            <Text style={styles.blockedSubText}>
                                {item.calls && item.sms ? "Blocked Completely" : item.calls ? "Blocked Calls Only" : "Blocked SMS Only"}
                            </Text>
                        </TouchableOpacity>
                    )}
                    scrollEnabled={false} // Prevents FlatList from conflicting with ScrollView
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    scrollContainer: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 20 },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
    settingText: { fontSize: 18, color: '#fff', flex: 1, marginLeft: 10 },
    blockContainer: { marginTop: 30, padding: 15, backgroundColor: '#1e1e1e', borderRadius: 10 },
    blockTitle: { fontSize: 20, fontWeight: 'bold', color: '#ff5555', marginBottom: 10, textAlign: 'center' },
    input: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 5, marginBottom: 10 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
    switchLabel: { fontSize: 16, color: '#fff' },
    button: { marginTop: 15, backgroundColor: '#ff5555', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    blockedItem: { backgroundColor: '#222', padding: 15, borderRadius: 10, marginVertical: 5 },
    blockedText: { color: '#fff', fontSize: 18 },
    blockedSubText: { color: '#bbb', fontSize: 14 },
});
