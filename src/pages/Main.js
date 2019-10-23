import React, { useEffect, useState } from 'react';
import { Alert, ButtonGroup, Text, TextInput,SafeAreaView, Image, StyleSheet, View, ScrollView } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements'

import prompt from 'react-native-prompt-android';

import { Container, Tab, Tabs, StyleProvider } from 'native-base';

import ok from '../assets/ok.png'

import api from '../services/api'

export default function Main({  navigation }) {
    const [presente, setPresente] = useState(false);
    const [projeto, setProjeto] = useState({nome: '', descricao: ''});
    const [senha, setSenha] = useState("");
    const user = navigation.getParam('user');
    const [timeoutProjeto, setTimeoutProjeto] = useState('');

    const senhaInvalida = () => {
        Alert.alert(
            'Senha Inválida',
            'A senha informada não confere com a senha do vereador informado.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
          );
    }

    const entrar = async () => {
        const response = await api.get(`/presenca.php?entrar=true&senha=${senha}&id=${user.id}`);
        const retorno = JSON.parse(response.data.replace('﻿', ''));
        
        if (retorno.erro) {
            senhaInvalida();
        }
        else {
            setSenha("");
            setPresente(retorno.presente);
        }
    }
    const sair = async () => {
        const response = await api.get(`/presenca.php?sair=true&senha=${senha}&id=${user.id}`);
        const retorno = JSON.parse(response.data.replace('﻿', ''));
        
        if (retorno.erro) {
            senhaInvalida();
        }
        else {
            setSenha("");
            setPresente(retorno.presente);
        }
    }

    const checkPresente = async () => {
        const response = await api.get('/presenca.php?id='+user.id);
        setPresente(JSON.parse(response.data.replace('﻿', '')).presente);
    }

    const checkProjeto = async () => {
        clearTimeout(timeoutProjeto);
        const response2 = await api.get(`/projeto.php?vereador=${user.id}`);
        const p = JSON.parse(response2.data.replace('﻿', ''));
        setProjeto(p);
        console.log(p);
        let tmp = setTimeout(checkProjeto, 10000);
        setTimeoutProjeto(tmp);
    }

    const favor = () => {
        prompt(
            'A Favor',
            'Para confirmar seu voto a favor do projeto, informe sua senha',
            [
             {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: password => votar(password, 1)},
            ],
            {
                type: 'numeric',
                cancelable: false,
                defaultValue: '',
                placeholder: 'Senha',
                keyboardType: 'numeric'
            }
        );
    }

    const contra = () => {
        prompt(
            'Contra',
            'Para confirmar seu voto contra o projeto, informe sua senha',
            [
             {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: password => votar(password, 2)},
            ],
            {
                type: 'numeric',
                cancelable: false,
                defaultValue: '',
                placeholder: 'Senha',
                keyboardType: 'numeric'
            }
        );
    }

    const abstencao = () => {
        prompt(
            'Abstenção',
            'Para confirmar sua abstenção no voto do projeto, informe sua senha',
            [
             {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: password => votar(password, 3)},
            ],
            {
                type: 'numeric',
                cancelable: false,
                defaultValue: '',
                placeholder: 'Senha',
                keyboardType: 'numeric'
            }
        );
    }

    const votar = async (password, tipo) => {
        const response = await api.get(`votar.php?senha=${password}&vereador=${user.id}&projeto=${projeto.id}&tipo_voto=${tipo}`);
        const obj = JSON.parse(response.data.replace('﻿', ''));
        if (obj.erro) {
            senhaInvalida();
        }
        else {
            clearInterval(timeoutProjeto);
            checkProjeto();
        }
    }

    useEffect(() => {
        checkPresente();
        checkProjeto();
        return () => clearInterval(timeoutProjeto);
    }, [user]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Tabs onChangeTab={e => { checkPresente(); checkProjeto(); }}>
                    <Tab heading='Presença'>
                        {presente ? 
                            (<Text style={styles.presente}>Presente</Text>) : 
                            (<Text style={styles.ausente}>Ausente</Text>)}
                        <View style={styles.cardsContainer}>
                            <View style={styles.card}>
                                <Image style={styles.avatar} source={{uri: user.avatar_url}} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text style={styles.bio} numberOfLines={1}>{user.subtitle}</Text>
                                </View>
                            </View>
                        </View>
                        <TextInput
                            placeholder="Senha"
                            keyboardType="numeric"
                            secureTextEntry={true}
                            value={senha}
                            onChangeText={t => { setSenha(t)}}
                            style={{
                                height: 46,
                                alignSelf: 'center',
                                backgroundColor: '#FFF',
                                borderWidth: 1,
                                borderColor: '#DDD',
                                borderRadius: 4,
                                marginTop: 20,
                                paddingHorizontal: 15,
                                width: '90%'
                            }}
                        />
                        {presente ? 
                        ( 
                            <Button
                                title="Sair"
                                buttonStyle={{backgroundColor: 'red'}}
                                onPress={e => sair(e)}
                            />
                        ) : 
                        (
                            <Button
                            title="Entrar"
                            onPress={e => entrar(e)}
                            />
                        )}
                        
                    </Tab>
                    <Tab heading='Votação'>
                        <View style={{
                            flex: 1,
                            justifyContent: 'space-between'
                        }}>
                            <ListItem
                                style={{flex: 1}}
                                leftAvatar={{
                                    title: user.name,
                                    size: "medium",
                                    source: {uri: user.avatar_url}
                                }}
                                title={user.name}
                                subtitle={user.subtitle}
                            />
                            <Card style={{flex: 1}} title={projeto.nome}>
                                <ScrollView style={{
                                    maxHeight: 150
                                    }}>
                                    <Text style={styles.bio}>{projeto.descricao}</Text>
                                </ScrollView>
                            </Card>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: "space-around",
                                flexDirection:'row',
                            }}>
                                {
                                    (!projeto.votado) &&
                                    <>
                                    <Button
                                        title="A Favor"
                                        onPress={e => favor()}
                                        buttonStyle={{width: 130}}
                                    />
                                    <Button
                                        title="Contra"
                                        onPress={e => contra()}
                                        buttonStyle={{backgroundColor: '#F00', width: 130}}
                                    />
                                    <Button
                                        title="Abstenção"
                                        onPress={e => abstencao()}
                                        buttonStyle={{backgroundColor: '#CC0', color: '#000', width: 130}}
                                    />
                                    </>
                                }
                            </View>
                            {(projeto.votado === '1') && <Button title="Votado a favor" />}
                            {(projeto.votado === '2') && <Button buttonStyle={{backgroundColor: '#F00'}} title="Votado contra" />}
                            {(projeto.votado === '3') && <Button buttonStyle={{backgroundColor: '#CC0'}} title="Se absteve da votação" />}
                        </View>
                    </Tab>
                </Tabs>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        marginTop: 30
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 400
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0
    },
    avatar: {
        flex: 1,
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 20
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 0
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
    },
    presente: {
        color: '#393',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    ausente: {
        color: '#933',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});