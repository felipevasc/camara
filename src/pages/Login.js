import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAvoidingView, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

import logo from "../assets/politico.png"
import api from '../services/api';

export default function Login({ navigation }) {
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', {id: user})
            }
        })
    }, []);

    async function handleLogin() {
        const response = await api.post('/x', { parametro: user });

        await AsyncStorage.setItem('user', response.id);

        navigation.navigate('Main', {id: response.id});
    }

    return (
        <KeyboardAvoidingView 
            behavior="padding"
            style={styles.container}
        >
            <Image source={logo} />

            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Informe seu usuário"
                placeholderTextColor="#999"
                style={styles.input}
                value={user}
                onChangeText={setUser}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F3F3",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
})