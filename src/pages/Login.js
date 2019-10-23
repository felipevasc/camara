import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { ScrollView, View, KeyboardAvoidingView, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

import logo from "../assets/politico.png"
import api from '../services/api';

import { ListItem } from 'react-native-elements'

export default function Login({ navigation }) {
    const [user, setUser] = useState('');
    const [vereadores, setVereadores] = useState([]);

    const selectUser = async u => {
        console.log(u);
        navigation.navigate('Main', {user: u});
       // await AsyncStorage.setItem('user', u.id);
        
    }

    useEffect(async () => {
        let user2 = await AsyncStorage.getItem('user');
        if (user2) {
     //       navigation.navigate('Main', {id: user2})
        }
        
        const response = await api.get('/vereadores.php');

        const tmp = JSON.parse(response.data.replace('﻿', '')).map(r => { 
            return { 
                id: r.id,
                name: r.nome_urna, 
                subtitle: r.nome,
                avatar_url: `${api.defaults.baseURL}/${r.imagem}`
            }
        });

        setVereadores(tmp);
    }, []);

    async function handleLogin() {
        const response = await api.post('/x', { parametro: user });

        await AsyncStorage.setItem('user', response.id);

        navigation.navigate('Main', {id: response.id});
    }

    return (
        <ScrollView>
                {
                    vereadores.map((l, i) => (
                    <ListItem
                        key={i}
                        leftAvatar={{ source: { uri: l.avatar_url } }}
                        title={l.name}
                        subtitle={l.subtitle}
                        button={true}
                        bottomDivider
                        onPress={() => selectUser(l)}
                    />
                    ))
                }
         
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 0,
        flexGrow: 1,
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
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
})