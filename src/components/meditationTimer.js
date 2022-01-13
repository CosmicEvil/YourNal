import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function MeditationTimer ({ navigation }) {
    const [inspirationalMessage, setInspirationalMessage] = useState("I dont fucking know");
    const [inspirationalMessageAuthor, setInspirationalMessageAuthor] = useState("Einstein");

    return (
        <View style={styles.container}>
            <Text h2 style={styles.message}>{inspirationalMessage}</Text>
            <Text style={styles.author}>{inspirationalMessageAuthor}</Text>

        </View>
      )

}


const styles = StyleSheet.create({
    container: {
      marginTop: 0,
      padding: 10,
      flex: 1,
      flexDirection: 'reverse-column',
      alignItems: 'center',
      backgroundColor: "#F1F2EB"
    }
  })