import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { Icon } from "react-native-elements/dist/icons/Icon";
import Toast from 'react-native-toast-message';

export default function SummaryOfJournal ({ navigation }) {
  const { getItem, setItem } = useAsyncStorage('journal');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

// Clear entry werkt nog niet -> komt dit nog adden maar kan in firebase deel gedaan worden
  function clearEntry(id){
    console.log("clearing");
    // setItems(items.filter(item => item !== id));
    getItem()
    .then((journalJSON) => {
      let journal = journalJSON ? JSON.parse(journalJSON) : [];
      //remove item from list
      journal= journal.filter(function(element) {
        return element.id !== id;
      });
      console.log("ID " + id);
      console.log( journal);
      setItems(journal);
     
      //set item in storage again
      setItem(JSON.stringify(journal))
        .then(() => {
          // navigation.navigate("Journal");
          Toast.show({
            text1: 'Item removed!',
            position: 'bottom'
          });
        }).catch((err) => {
          console.error(err);
          Toast.show({
            type: 'error',
            text1: 'An error occurred and the item could not be removed',
            position: 'bottom'
          });
        });
    })
    .catch((err) => {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'An error occurred and a new item could not be fetched',
        position: 'bottom'
      });
    });
  }

  function getJournalList () {

    getItem()
      .then((journalJSON) => {
        // clearAllData();
        const journal = journalJSON ? JSON.parse(journalJSON) : [];
        setItems(journal.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'An error occurred',
          position: 'top'
        });
      });
  }

  function renderCard ({item}) {
    return (
      <Card>
        <View style={styles.delete}>
        <Icon
              name="trash"
              type="feather"
              color="#566246"
              size="8"
              onPress={() => clearEntry(item.id)}
            />
          </View>
         <Card.Title style={styles.cardDate}>
         <Text> {
            new Date(item.time).toLocaleDateString()
          }</Text>
        </Card.Title>
        <Card.FeaturedTitle style={styles.cardTitle}>
        {item.question}
        </Card.FeaturedTitle>
        <Card.Divider />
        <Text style={styles.cardContent}>{item.body}</Text>
      </Card>
    )
  }
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getJournalList);

    return unsubscribe;
  }, [])

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
        onRefresh={getJournalList} style={styles.list} data={items}
        renderItem={renderCard} keyExtractor={(item) => item.id} />
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
    
  }
})