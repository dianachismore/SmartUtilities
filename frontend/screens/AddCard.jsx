import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Button
} from 'react-native';
import { addCard } from '../redux/action';
import { useDispatch, useSelector} from 'react-redux'
import { CreditCardInput } from "react-native-credit-card-input";

const AddCard = ({ navigation, route}) => {
  const {user} = useSelector(state => state.auth)
  const [number, setNumber] = useState(0);
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState(0);
  const [cardholder, setCardholder] = useState(user.name);
  const { loading, message, error } = useSelector(state => state.message)
  const dispatch = useDispatch();

  const handleAddCard = async() => {
    await dispatch(addCard({ number, expiry, cvc, cardholder }));
    navigation.goBack()
  };

  useEffect(() => {
    if (error) {
        alert(error);
        dispatch({ type: "clearError" });
        dispatch({ type: "clearError" });
    }
    if (message) {
        alert(message)
        dispatch({ type: "clearMessage" });
    }
}, [alert, error, message, dispatch])

const _onChange =(data) => {
  const cardNumber = data.values && data.values.number ? data.values.number.replace(/\s/g, '') : '';
  setNumber(cardNumber);
  setExpiry(data.values && data.values.expiry ? data.values.expiry : '');
  setCvc(data.values && data.values.cvc ? data.values.cvc : '');
}

  return (
    <ScrollView style={styles.container}>
    <Text style={styles.text}>Add your Credit Card Info</Text>
    <Text style={styles.text2}>Make your future payments easier</Text>
    <CreditCardInput 
      inputContainerStyle={styles.inputContainerStyle}
      inputStyle={styles.inputStyle}
      labelStyle={styles.labelStyle}
      inputContainerStyle={styles.cardInputsStyle}
      validColor="#fff"
      placeholderColor="#ccc"
      onChange={_onChange}
      cardImageFront={require('../assets/card_front.jpg')}
      cardImageBack={require('../assets/card_back.jpg')}
     />

  <TouchableOpacity 
  onPress={handleAddCard}
  style={styles.button}>
    <Text
      style={styles.buttonText}>
      Add Card
    </Text>
  </TouchableOpacity>
</ScrollView>
  );
};

export default AddCard

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70
  },
  text:{
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  text2:{
    color: 'grey',
    fontSize: 12,
    paddingLeft: 20,
    paddingBottom: 50,
  },
  button : {
    backgroundColor:'#900',
    width:150,
    height:45,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    marginTop:70,
    borderRadius:5
  },
  buttonText : {
    fontSize: 15,
    color: '#000',
    fontWeight:'bold',
    textTransform:'uppercase'
  },
  inputContainerStyle : {
    backgroundColor:'#fff',
    borderRadius:5, 
    flexDirection: 'column'
  },
  inputStyle : {
    backgroundColor:'#000',
    paddingLeft:15,
    borderRadius:5,
    color:'#fff'
  },
  labelStyle : {
    marginBottom:5,
    fontSize:12
  },
  cardInputsStyle:{
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  }
 
});
