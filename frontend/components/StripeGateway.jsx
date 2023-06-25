import React, { useState, useEffect } from 'react';
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
import CreditCardDisplay from 'react-native-credit-card-display';

// create a component
const CURRENCY = 'RON';
var CARD_TOKEN = null;
const { width } = Dimensions.get("screen")
const StripeGateway = ({route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedCard} = route.params;
  const [amount, setAmount] = useState(null);
  const { user, loading } = useSelector(state => state.auth)
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar.url);
  //for updating the amount to 0 after successfully payment
  const [paymentStatus, setPaymentStatus] = useState(null);

  const onSubmit = async () => {
    console.log("1AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIICIIIIIIIIIIIIIIII")
    setIsLoading(true);
    let creditCardToken;
    try {
      const card = {
        'card[number]': selectedCard.number,
        'card[exp_month]': selectedCard.expiry.split('/')[0],
        'card[exp_year]': selectedCard.expiry.split('/')[1],
        'card[cvc]': selectedCard.cvc
      };
      console.log("0AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIICIIIIIIIIIIIIIIII")
      creditCardToken = await fetch('https://api.stripe.com/v1/tokens', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
        },
        method: 'post',
        body: Object.keys(card)
          .map(key => key + '=' + card[key])
          .join('&')
      }).then(response => response.json());
      console.log(creditCardToken)

      if (creditCardToken.error) {
        alert("creditCardToken error");
        setIsLoading(false);
        return;
      }
      console.log("2AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIICIIIIIIIIIIIIIIII")
    } catch (e) {
      console.log("e",e);
      setIsLoading(false);
      return;
    }
    
    // Send a request to your server with the received credit card token
    const { error } = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      alert(error)
    } else {
      console.log("3AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIICIIIIIIIIIIIIIIII")
      let pament_data = await charges();
      console.log('pament_data', pament_data);
      if(pament_data.status == 'succeeded')
      {
        setPaymentStatus('succeeded');
        alert("Payment Successfully");
      }
      else{
        alert('Payment failed');
      }
    }
    setIsLoading(false);
  };

  const subscribeUser = async (creditCardToken) => {
    CARD_TOKEN = creditCardToken.id;
    return axios.post('http://127.0.0.1:5000/api/v1/saveutilities', {
      amount: amount
    });
  }

  useEffect(() => {
    // make a GET request to your Node.js server to get the monthly utility amount
    axios.get("http://127.0.0.1:5000/api/v1/getamount")
      .then(response => {
        setAmount(response.data.amount);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (paymentStatus === 'succeeded') {
      // Update the amount to 0 in the database
      axios.put('http://127.0.0.1:5000/api/v1/updateamountafterpayment')
        .then(response => {
          setAmount(0);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [paymentStatus]);

  const charges = async () => {
    console.log("5AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIICIIIIIIIIIIIIIIII")
    const card = {
      'amount': amount * 100, 
      'currency': CURRENCY,
      'source': CARD_TOKEN,
      'description': "Utilitiati",
    };
    return fetch('https://api.stripe.com/v1/charges', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${Secret_key}`
      },
      method: 'post',
      body: Object.keys(card)
        .map(key => key + '=' + card[key])
        .join('&')
    }).then(response => response.json());
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
      
      <Text style={{ fontSize: 17, textAlign:'center', marginTop: 90,fontWeight: 'bold',color: 'grey',fontSize: 15, }}>Send {amount} lei to your Administrator</Text>
      <TouchableOpacity 
        onPress={onSubmit}
        style={styles.button}
        disabled={isLoading}>
        {isLoading ? (
          <Text style={styles.buttonText}>Loading...</Text>
        ) : (
          <Text style={styles.buttonText}>Pay Now</Text>
        )}
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
    marginRight: 30,
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
export default StripeGateway;