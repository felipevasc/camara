import React from 'react';
import { SafeAreaView, Image, StyleSheet } from 'react-native';

export default function Main() {
    return (
        <SafeAreaView>
            <Image source={{uri: 'https://reactnavigation.org/img/spiro_white.svg'}} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})