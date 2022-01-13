// components/signup.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ActivityIndicator } from 'react-native';
// import firebase from '../firebase/firebase.utils';
import { auth, createUserProfileDocument } from '../firebase/firebase.utils';

import { Button } from 'react-native-elements/dist/buttons/Button';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
export default class Signup extends Component {
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = async event => {
    //event.preventDefault();
    const { displayName, email, password } = this.state;

    if(email === '' && password === '') {
      Alert.alert('Enter details to signup!');
      return;
    } 
    
    try {
      this.setState({
        isLoading: true,
      })

      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await createUserProfileDocument(user,   { displayName });
      this.setState({
        displayName: '',
        email: '',
        password: '',
        isLoading: false,
      });
      console.log('User registered successfully!')
      this.props.navigation.navigate('Home')


    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong, please try again!',
        position: 'bottom'});
      this.setState(
        { isLoading: false,
        errorMessage: error.message 
      });
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />
        <Button
          style={styles.loginButton}
          title="Signup"
          onPress={(event) => this.registerUser()}
        />
      
     
        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 5,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 5

  },
  loginText: {
    color: '#4A4A48',
    marginTop: 10,
    textAlign: 'center',
  },
  loginButton:{
    backgroundColor: '#A4C2A5',
    marginBottom: 5,
    borderRadius: 5

  },

  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});