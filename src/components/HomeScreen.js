import { Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { prompts } from '../prompts';
import * as Yup from 'yup';
import { firestore } from '../firebase/firebase.utils';
import firebase from '../firebase/firebase.utils';

// import { usersCollection } from '../firebase/firebase.utils';
export default function HomeScreen ({ navigation }) {

  const [randomElement, setRandomElement] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [title, setTitle] = useState(randomElement);
  const [isEnabled, setIsEnabled] = useState(false);
  const [user, setUser] = useState(firebase.auth().currentUser);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    isEnabled ?
    setTitle("Regular Journal Entry") :setTitle(randomElement);

  };

  const saveItem = async (values,userAuth) => {
   // let userID = Auth.auth().currentUser?.uid
   if(!values.body){
    Toast.show({
        type: 'error',
        text1: 'Journal Entry is required',
        position: 'bottom'
    });
    return;
    }


    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    try {
      const key = uuid.v4()
      await userRef.collection('journalList').doc(key).set({
        key:key,
        time: new Date(),
        question: title,
        body: values.body
      });
      setRandomElement(prompts[Math.floor(Math.random() * prompts.length)]);
      Toast.show({
        text1: 'Added the entry!',
        position: 'bottom'
      });

      navigation.navigate('Journal')

    } catch (error) {
      console.log('error creating user: ', error.message);
      Toast.show({
        type: 'error',
        text1: 'An error occurred and a new item could not be saved',
        position: 'bottom'
      });
    }
   
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
        console.log('Hi :' + title,values.body);
        resetForm({ values: '' })
        saveItem(values, user);
      }}>
      {
        formik => (
        <View style={style.container}>
          <Text h2 style={style.title} >Welcome to YourNal</Text>
          {
            isEnabled ?
            <Text h4 style={style.subtitle} >{title}</Text>
            : null
          }
          <View style={style.toggle}>
            <Text style={style.subtitleTwo} >Do you want a prompt?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#A4C2A5" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
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
  subtitleTwo:{
    marginRight:10,
    height: 20,
    textAlign: 'left',
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
  },
  toggle:{
    flex: 0.1,
    flexDirection: 'row',
    color: "#A4C2A5",
    fontSize: 10,
    justifyContent:'center',
    textAlign: 'left',
    width: "90%"
  }
})

