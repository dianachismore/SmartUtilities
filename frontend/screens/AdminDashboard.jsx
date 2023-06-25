import React, { useState, useEffect } from 'react';
import { Image, FlatList, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Secret_key } from '../components/keys';
import Modal from 'react-native-modal';

const AdminDashboard = () => {
  const [isRender, setisRender] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [utilities, setUtilities] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Store the selected item here

  const image = require('../assets/apartment.png');
  const currency = 'RON';

  useEffect(() => {
    // Make a GET request to fetch the utility data from the backend
    fetch('http://127.0.0.1:5000/api/v1/admindashboard')
      .then(response => response.json())
      .then(data => setUtilities(data))
      .catch(error => console.error(error));
  }, []);

  const onPressItem = (item) => {
    setSelectedItem(item); // Set the selected item
    setisModalVisible(true);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onPressItem(item)}
      >
        <View style={styles.iconIndex}>
          <Image style={styles.houseIcon} source={image} />
          <Text style={styles.index}>{item.user.apartamentNr}</Text>
        </View>
        <Text style={styles.text}>{item.amount}</Text>
        <Text style={styles.currency}>{currency}</Text>
      </TouchableOpacity>
    );
  };

  const handleEditItem = () => {
    if (!selectedItem) return; // Handle the case where no item is selected
  
    // Make a PUT request to update the amount in the backend
    fetch(`http://127.0.0.1:5000/api/v1/updateutilities`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Secret_key}`, // Add your authorization token here
      },
      body: JSON.stringify({
        amount: selectedItem.editAmount,
        userId: selectedItem.user._id,
      }),
    })
      .then(response => response.json())
      .then(() => {
        // Update the local utilities state with the edited amount
        const updatedUtilities = utilities.map(item => {
          if (item._id === selectedItem._id) {
            return {
              ...item,
              amount: selectedItem.editAmount,
            };
          }
          return item;
        });
        setUtilities(updatedUtilities);
      })
      .catch(error => console.error(error));
  };

  const onPressSaveEdit = () => {
    handleEditItem();
    setisModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={utilities.sort((a, b) => a.user.apartamentNr - b.user.apartamentNr)}
        keyExtractor={(item, index) => index.toString()} // Use index as the key
        renderItem={renderItem}
      />
        <Modal
          isVisible={isModalVisible}
          swipeDirection="down"
          onSwipeComplete={() => setisModalVisible(false)}
          onBackdropPress={() => setisModalVisible(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
        <View style={styles.modalView}>
          <Text style={styles.text}>Update Amount for this Month </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => {
              setSelectedItem(prevItem => ({
                ...prevItem,
                editAmount: text,
              }));
            }}
            value={selectedItem ? selectedItem.editAmount : ''}
            editable={true}
            multiline={false}
            maxLength={200}>
          </TextInput>
          <TouchableOpacity
            onPress= {() => onPressSaveEdit()}
            style={styles.touchableSave}>
              <Text style={styles.textSave}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding:30
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    marginVertical: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center'
  },
  textInput:{
    width: '50%',
    height: 50,
    borderColor: 'grey',
    borderWidth: 1,
    fontSize: 20,
    borderRadius: 10,
  },
  modalView:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginVertical: 90,
    marginHorizontal: 30,
    borderRadius: 10,
    padding:  20
  },
  touchableSave:{
    backgroundColor: "#900",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    height: 50,
    width: 100,
    borderRadius: 10,
  },
  textSave: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  houseIcon: {
    height: 60,
    width: 60,
  },
  index:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '35%',
    marginTop: '22%',
    fontSize: 30,
    fontWeight: 'bold',

  },
  currency:{
    marginVertical: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 'auto',

  }
});

export default AdminDashboard