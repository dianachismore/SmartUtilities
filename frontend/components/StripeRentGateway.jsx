import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native';
import { Secret_key, STRIPE_PUBLISHABLE_KEY } from '../components/keys';
import axios from "axios"; // import axios library
import { PaymentContext } from './PaymentContext';
import CreditCardDisplay from 'react-native-credit-card-display';

const { width } = Dimensions.get("screen")
const StripeRentGateway = ({navigation,route}) => {
    const { user, loading } = useSelector(state => state.auth)
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar.url);
    const { selectedCard, rentAmount} = route.params;
    const { addPayment } = useContext(PaymentContext);


    const onSubmit = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/v1/payrent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`, // Include the access token for authentication
            },
            body: JSON.stringify({
              amount: rentAmount, // Replace with the actual rent amount
            }),
          });
      
          const data = await response.json();
          console.log('Payment Intent:', data.paymentIntent);
          // Process the payment intent as needed
          alert("Payment Successfully");
          const paymentDate = new Date();
          const payment = {
            amount: rentAmount,
            date: paymentDate,
          };
          addPayment(payment); // Add the payment to the payment history
          navigation.navigate('payment');
        } catch (error) {
          console.error('Payment error:', error);
          alert('Payment failed');
          // Handle the error
        }
      };

  return (
    <ScrollView style={styles.containerBig}>
      <View style={styles.horizontalPaddingView}>
            <View style={styles.container}>
                <View>
                    <Text style={values.h1Style}>Hello, {name}</Text>
                    <Text style={values.pStyle}>Welcome to your Payment Gateway!</Text>
                </View>
                <Image style={styles.image} source={{ uri: avatar}}/>
            </View>
        </View>

      <Text style={{ fontSize: 17, margin: 30, marginTop: 60,fontWeight: 'bold' }}>Are you sure you want to use this card:</Text>
      <View style={styles.cardContainer}>
      <CreditCardDisplay
        number={selectedCard?.number}
        cvc={selectedCard?.cvc}
        expiration={selectedCard?.expiry}
        name={name}
        frontImage={require('../assets/card_front.jpg')}
        backImage={require('../assets/card_back_display.jpg')}
      />
      </View>
      <Text style={{ fontSize: 17, textAlign:'center', marginTop: 90,fontWeight: 'bold',color: 'grey',fontSize: 15, }}>Send {rentAmount} lei to your Landlord</Text>
      <TouchableOpacity 
        onPress={onSubmit}
        style={styles.button}>
          <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const values = {
  horizontalPadding: 25,
  verticalPadding: 20,
  h1Style: {
      fontSize: 20,
      fontWeight: 'bold'
  },
  h2Style: {
      fontSize: 16,
      fontWeight: 'bold'
  },
  pStyle: {
      color: 'grey',
      fontSize: 12,
  },
  pWhiteStyle: {
      color: 'white',
      fontSize: 12,
  }
}


// define your styles
const styles = StyleSheet.create({
  horizontalPaddingView: {
    paddingHorizontal: values.horizontalPadding,
},
  containerBig: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white'
},
  container: {
    backgroundColor: 'white',
        paddingTop:  40,
        flexDirection: 'row',
        justifyContent: 'space-between',
  },
  cardContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30
},
  ImgStyle: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
},
  button : {
    backgroundColor:'#900',
    width:150,
    height:45,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    borderRadius:5
  },
  buttonText : {
    fontSize: 15,
    color: '#f4f4f4',
    fontWeight:'bold',
    textTransform:'uppercase'
  },
  inputContainerStyle : {
    backgroundColor:'#fff',
    borderRadius:5
  },
  inputStyle : {
    backgroundColor:'#222242',
    paddingLeft:15,
    borderRadius:5,
    color:'#fff'
  },
  labelStyle : {
    marginBottom:5,
    fontSize:12
  }
 
});

//make this component available to the app
export default StripeRentGateway;