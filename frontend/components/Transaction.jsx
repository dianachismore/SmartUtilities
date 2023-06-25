import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {useContext} from 'react'
import { PaymentContext } from './PaymentContext';

const Transaction = ({transaction, onPress}) => {
  let heading;
  let image;
  let sign = '-';
  if (transaction.type === 'rent') {
    heading = 'RENT';
    image = require('../assets/key.png') 
  } else {
    heading = 'UTILITIES';
    image = require('../assets/home.png')
  }
  if (transaction.apartmentNumber) {
    heading = 'Apartment ' + transaction.apartmentNumber;
    sign ='+';
  }
  

  const transactionDate = new Date(transaction.date).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity>
    <View style={styles.container}>
      <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
              <Image style={styles.image} source={image} />
          </View>
          <View>
              <Text style={values.pStyle}>{heading}</Text>
              <Text style={values.h2Style}>{sign}{transaction.amount} RON</Text>
              <Text style={values.pStyle}>{transactionDate}</Text>
          </View>
      </View>
    </View>
    </TouchableOpacity>
  )
}

export default Transaction

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: 70,
        borderRadius: 10,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingEnd: 15,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    image: {
      width: 25,
      height: 25,
    },
    imageContainer: {
      height: 50,
      width: 50,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
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