import "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import SummaryOfJournal from "./src/components/SummaryOfJournal";
import HomeScreen from "./src/components/HomeScreen";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Toast from 'react-native-toast-message';
import Login from './src/components/login';
import Signup from './src/components/signup';
import Dashboard from './src/components/dashboard';
import firebase from "./src/firebase/firebase.utils";``

const Stack = createStackNavigator();
let initial = "Home";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    initial = "Login";
  } else {
    console.log(firebase.auth().currentUser);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName={initial}
      screenOptions={{
        // headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#566246',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: 'Signup' }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={
          {title: 'Login'},
          {headerLeft: null}
        }
      />
      <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        headerRight: () => (
          <View style={style.iconContainer}>
            <Icon
              name="book"
              type="feather"
              color="#fff"
              style={style.headerIcon}
              onPress={() => navigation.navigate("Journal")}
            />
            <Icon
              name="user"
              type="feather"
              color="#fff"
              style={style.headerIcon}
              onPress={() => navigation.navigate("Dashboard")}
            />
        </View>
      ),  headerLeft: null
    }
    )}
  />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={
          { title: 'Dashboard' }
        }
      />
       <Stack.Screen
        name="Journal"
        component={SummaryOfJournal}
        options={
          { title: 'Journal' }
        }
      />
      </Stack.Navigator>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 15,
  },
});


