// components/login.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import firebase from '../firebase/firebase.utils';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from '../firebase/firebase.utils';
import Toast from 'react-native-toast-message';

export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
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

  userLogin = () => {
    // const auth = getAuth();
    if(this.state.email === '' && this.state.password === '') {
      Toast.show({
        type: 'error',
        text1: 'Enter details to login',
        position: 'bottom'
      });    
    } else {
      this.setState({
        isLoading: true,
      })

      firebase.auth().signInWithEmailAndPassword(this.state.email.toString(), this.state.password)
      .then((userCredential) => {
        console.log(userCredential)
        console.log('User logged-in successfully!')
        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Home')
      })
      .catch(error => {
        console.log(error.message)
         
        this.setState({ isLoading: false,
        errorMessage: error.message })
        var errorCode = error.code;
        let errorMsg = 'Something went wrong';

        if ( errorCode == 'auth/wrong-password' ) {
            errorMsg = 'Wrong password';
        } else if ( errorCode == 'auth/invalid-email' ) {
          errorMsg = 'Please provide a valid email';
        } else if ( errorCode == 'auth/invalid-email' ) {
          errorMsg = 'Please provide a valid email';
        } 

        Toast.show({
          type: 'error',
          text1: errorMsg,
          position: 'bottom'
         });
      })
    }
  }

  signInWithGoogle = () => {
    this.setState({
      isLoading: true,
    })
    firebase.auth().signInWithPopup(googleProvider).then((res) => 
    {
      console.log(res)
      console.log('User logged-in successfully!')
      this.setState({
        isLoading: false,
        email: '',
        password: ''
      })
      this.props.navigation.navigate('Home')
    })
    .catch(error => {
      Toast.show({
      type: 'error',
      text1: 'Something went wrong, please try again!',
      position: 'bottom'
    });
      this.setState({ isLoading: false,
      errorMessage: error.message })}
      )
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
          title="Signin"
          onPress={() => this.userLogin()}
        />
        <Button
          style={styles.loginButtonGoogle}
          title="Signin with google"
          onPress={() => this.signInWithGoogle()}
        />
        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Signup')}>
          Don't have account? Click here to signup
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
    padding: 12,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  loginText: {
    color: '#4A4A48',
    marginTop: 25,
    textAlign: 'center',
    borderRadius: 5
  },
  loginButton:{
    backgroundColor: '#A4C2A5',
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5

  },
  loginButtonGoogle:{
    backgroundColor: '#566246'
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