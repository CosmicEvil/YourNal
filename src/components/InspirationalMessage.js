import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Text } from 'react-native-elements';


export default function InspirationalMessage ({ navigation }) {
   
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("Fetching Quote.....");

    const api_url ="https://type.fit/api/quotes";

    async function getapi(url)
    {
      const response = await fetch(url);
      let data = await response.json();
      let random = Math.floor(Math.random() * data.length);
    //   console.log(data[random].text);
      setAuthor(data[random].author);
      setContent(data[random].text);
    }

    useEffect(() => {
        getapi(api_url);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Here's some inspiration!</Text>
            <View style={styles.quote}>
                <Text style={styles.title}>{content}</Text>
                <Text style={styles.subtitle}>{author}</Text>
            </View>
            <View style={styles.bottom}>
                <Text h4>Not inspired enough? <br />Get another quote!</Text>
                <Button title="New Quote" onPress={() => getapi(api_url)} style={styles.button}/>
            </View>
        </View>
      )

}

const styles = StyleSheet.create({
    container: {
      marginTop: 0,
      padding: 10,
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: "#F1F2EB"
    },
    quote: {
        margin: 20,
        padding: 10,
        flex: 3,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: "#fff"
      },
      bottom:{
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
      },
      mainTitle: {
        margin: 10,
        fontSize:30,
        fontStyle:"italic",
        color: "#4A4A48"
      },
    title: {
        margin: 10,
        fontSize:30,
        fontStyle:"italic",
        color: "#4A4A48"
      },
      subtitle:{
        fontSize:15,

        marginTop: 10,
        paddingLeft:10,
        paddingRight:10,
        textAlign: 'right',
        width: '100%',
        color: "#4A4A48"
      },
      button: {
        marginTop:20,
        backgroundColor: '#A4C2A5'
      },

  })