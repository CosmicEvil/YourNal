// database/firebaseDb.js

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAEquJxT70eh-FN9krKvpuf78AmK62p6SY",
  authDomain: "yournal-77859.firebaseapp.com",
  projectId: "yournal-77859",
  storageBucket: "yournal-77859.appspot.com",
  messagingSenderId: "67273205758",
  appId: "1:67273205758:web:8e34502eaa7a9afd7cc2af",
  measurementId: "G-8RW0NJT62W",
};

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

 export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });


export default firebase;