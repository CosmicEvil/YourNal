import { Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { prompts } from '../prompts';
import * as Yup from 'yup';
import { usersCollection } from '../firebase/firebase.utils';
export default function HomeScreen ({ navigation }) {

const { getItem, setItem } = useAsyncStorage('journal');

  const [randomElement, setRandomElement] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [title, setTitle] = useState(randomElement);

  function newTask (values) {

	if(!values.body){
        Toast.show({
            type: 'error',
            text1: 'Journal Entry is required',
            position: 'bottom'
        });
        return;
    }
    getItem()
    .then((journalJSON) => {
      let journal = journalJSON ? JSON.parse(journalJSON) : [];
      //add a new item to the list
      journal.push({
        id: uuid.v4(),
        time: new Date(),
        question: title,
        body: values.body
      });
      setRandomElement(prompts[Math.floor(Math.random() * prompts.length)]);
      // usersCollection
      //set item in storage again
      setItem(JSON.stringify(journal))
        .then(() => {
          // navigation.navigate("Journal");
          Toast.show({
            text1: 'Added the entry!',
            position: 'bottom'
          });
        }).catch((err) => {
          console.error(err);
          Toast.show({
            type: 'error',
            text1: 'An error occurred and a new item could not be saved',
            position: 'bottom'
          });
        });
    })
    .catch((err) => {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'An error occurred and a new item could not be saved',
        position: 'bottom'
      });
    });
  }

  useEffect(() => {
    // action on update of movies
    console.log("randomElement",randomElement);
    setTitle(randomElement);
  }, [randomElement]);
  return (
    <Formik
      initialValues={{body: ''}}
      onSubmit={(values, {resetForm}) => {    
        console.log('Hi :',values);
        resetForm({ values: '' })
        newTask(values);
      }}>
      {
        formik => (
        <View style={style.container}>
          <Text h2 style={style.title} >Welcome to YourNal</Text>
          <Text h4 style={style.subtitle} >{title}</Text>
          <Input
           value={formik.values.body}
            multiline = {true}
            numberOfLines = {8}
            placeholder="Write your journal entry here"
            onChangeText={formik.handleChange('body')}
            onBlur={formik.handleBlur('body')}
            style={style.input}
            inputContainerStyle={{borderBottomWidth: 0}}
          />
          <Button title="Submit to the Yournal" onPress={formik.handleSubmit} style={style.button}/>
        </View>
      )}
    </Formik>
  )
}
const style = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#F1F2EB"
  },
  title: {
    marginBottom: 20,
    color: "#4A4A48"
  },
  subtitle:{
    marginBottom: 10,
    paddingLeft:10,
    paddingRight:10,
    textAlign: 'center',
    color: "#4A4A48"
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#Fff",
    borderRadius: 20,
    padding:20
  },
  button: {
    backgroundColor: '#A4C2A5'
  }
})

