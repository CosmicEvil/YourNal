import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { Icon } from "react-native-elements/dist/icons/Icon";
import Toast from 'react-native-toast-message';
import { firestore } from '../firebase/firebase.utils';
import firebase from '../firebase/firebase.utils';
export default function SummaryOfJournal ({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(firebase.auth().currentUser);

  const clearEntryFirebase = async (id) => {

    if (!user) {
     Toast.show({
       type: 'error',
       text1: 'Not logged in!',
       position: 'top'
     });
     return;
   };

    const userRef = firestore.doc(`users/${user.uid}`);

   try {
    await userRef.collection('journalList').doc(id).delete()
    const snapshot = await userRef.collection('journalList').get()
    setItems(snapshot.docs.map(doc => doc.data()).sort((a, b) => b.time - a.time));
    setLoading(false);

   } catch (error) {
     console.log('error deleting the item: ', error.message);
     Toast.show({
         type: 'error',
         text1: 'An error occurred',
         position: 'top'
     });
   }
  }


  const fetchJournals = async (values) => {
    

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Not logged in!',
        position: 'top'
      });
      return;
    };

    const userRef = firestore.doc(`users/${user.uid}`);

    try {
      const snapshot = await userRef.collection('journalList').get()
      setItems(snapshot.docs.map(doc => doc.data()).sort((a, b) => b.time - a.time));
      console.log(items)
      setLoading(false);

    } catch (error) {
      console.log('error fetching the list: ', error.message);
      Toast.show({
          type: 'error',
          text1: 'An error occurred',
          position: 'top'
      });
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchJournals();
  }, []);

  function renderCard ({item}) {
    return (
      <Card>
        <View style={styles.delete}>
          <Icon
                name="trash"
                type="feather"
                color="#566246"
                size="8"
                onPress={() => clearEntryFirebase(item.key)}
              />
        </View>
        <Card.Title style={styles.cardDate}>
          <Text>
            {item.time.toDate().toDateString()}
          </Text>
        </Card.Title>
        <Card.FeaturedTitle style={styles.cardTitle}>
          {item.question}
        </Card.FeaturedTitle>
        <Card.Divider />
        <Text style={styles.cardContent}>
          {item.body}
        </Text>
      </Card>
    )
  }
  
  if(loading){
    return(
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {
        items.length == 0
      ? <Card>
          <Card.FeaturedTitle style={styles.cardTitleEmpty}>
          Add a journal entry to view it here!!
          </Card.FeaturedTitle>
        </Card>
      :
      <FlatList refreshing={loading}
        onRefresh={fetchJournals} style={styles.list} data={items}
        renderItem={renderCard} keyExtractor={(item) => item.key} />
        }
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
  },
  list: {
    width: '100%'
  },
  cardTitle: {
    textAlign: 'left',
    color: "#4A4A48"
  },
  cardTitleEmpty: {
    textAlign: 'center',
    fontSize: 30,
    color: "#4A4A48"
  },
  cardDate: {
    flex: 1,
    flexDirection: 'row',
    color: "#4A4A48",
    fontSize: 10,
    justifyContent:'space-between',
    textAlign: 'left',
    width: "100%"
  },
  delete:{
    position: 'absolute', right: 0, top: 0, zIndex: 10,
    
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F2EB'
  }
})