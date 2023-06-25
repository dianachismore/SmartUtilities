import { StyleSheet, Text, View, Image , ScrollView, TextInput, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper'
import Icon from "react-native-vector-icons/Ionicons";
import CreditCardDisplay from 'react-native-credit-card-display';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector} from 'react-redux';
import { getUserCards } from '../redux/action';
import { CreditCardInput } from "react-native-credit-card-input";
import { Secret_key, STRIPE_PUBLISHABLE_KEY } from '../components/keys';

const PayYourUtilities = ({ navigation, route}) => {
    const [amount, setAmount] = useState(0);
    const [password, setPassword] = useState("");
    const [selectedCard, setSelectedCard] = useState(0);

    const dispatch = useDispatch();

    const cards = useSelector(state => state.card);
  
    useEffect(() => { 
      dispatch(getUserCards());
    }, [cards]);
  
    const [activeSlide, setActiveSlide] = useState(0);
    const handleSnapToItem = index => {
        setActiveSlide(index);
        setSelectedCard(cards.card[index]);
      };
    // Add this useEffect hook to handle the initial selection
    useEffect(() => {
        // Check if no card has been selected
        if (!selectedCard && cards && cards.card && cards.card.length > 0) {
          // Select the first card by default
          handleSnapToItem(0);
        }
      }, [selectedCard, cards && cards.card]);

      const handlePassword = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/v1/verifypassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password }), 
          });
          const data = await response.json();
          if (response.ok) {
            navigation.navigate("stripegateway", {selectedCard, amount})
          } else {
            alert('Incorrect Password.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Incorrect Password.');
        }
      };

    return (
        <ScrollView style={styles.containerBig}>
            <Text style={{ fontSize: 20, marginLeft: 20,marginTop: 20,fontWeight: 'bold' }}>Pay Your Utilities</Text>
            <Text style={styles.text2}>Make safe payments with Smart Utilities</Text>
        <View style={{justifyContent: 'center'}}>
        <View>
            <Carousel
            data={cards.card}
            renderItem={({ item }) => (
                <View>
                <CreditCardDisplay
                    number={item.number}
                    cvc={item.cvc}
                    expiration={item.expiry}
                    name={item.cardholder}
                    frontImage={require('../assets/card_front.jpg')}
                    backImage={require('../assets/card_back_display.jpg')}
                />
                </View>
            )}
            sliderWidth={400}
            itemWidth={300}
            layout="default"
            onSnapToItem={handleSnapToItem}
            />
        </View>
        <TouchableOpacity style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 40}}>
            <Icon name="add-circle-outline" size={20} color="black" />
            <Text style={{ fontSize: 15 }} onPress={() => navigation.navigate("addcard")}>Add another card</Text>
        </TouchableOpacity>
        <View style={{height: 30}}></View>
        <View style={{alignItems: "center"}}>
        <View style={{ width: "75%"}}>
           
            <TextInput
                secureTextEntry
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
        </View>
        <View style={{height:30}}></View>
        <Button
            onPress={() => handlePassword()}
            style={styles.btn}>
            <Text style={{ color: "#fff" }}>Send to your administrator</Text>
        </Button>
        </View>
        </View>
        </ScrollView>
    );
};

export default PayYourUtilities





const stylesChoosePhoto = StyleSheet.create({
    container: {
        width: '80%',
        height: 190,
        borderRadius: 15,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: 190,
        borderRadius: 15,
    },
    icon: {
        width: 50,
        height: 50,
        marginTop: -200
    }
    
})

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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    text2:{
        color: 'grey',
        fontSize: 12,
        paddingLeft: 20,
        paddingBottom: 40,
      },
    containerBig: {
        flex: 1,
        paddingTop: values.verticalPadding + 20,
        backgroundColor: 'white'
    },
    horizontalPaddingView: {
        paddingHorizontal: values.horizontalPadding,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#b5b5b5",
        padding: 10,
        paddingLeft: 15,
        borderRadius: 15,
        marginVertical: 15,
        fontSize: 15,
    },
    btn: {
        backgroundColor: "#900",
        padding: 5,
        width: "70%",
    },
})

