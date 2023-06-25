import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import Category from '../components/Cathegory';
import SearchBar from '../components/SearchBar';
import Transaction from '../components/Transaction';
import { PaymentContext } from '../components/PaymentContext';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';


// Request permission for receiving push notifications
const registerForPushNotifications = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  if (status !== 'granted') {
    console.log('Permission to receive push notifications denied');
    return;
  }

  // Get the Expo push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo push token:', token);

  // Send the token to your backend API
  // Make an API call to your backend and associate the token with the landlord's account
  // You'll need to implement this API endpoint in the backend
  await fetch('http://127.0.0.1:5000/api/v1/pushtoken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expoPushToken: token,
    }),
  });
};
const Payment = ({ navigation, route }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar.url);
  const { paymentHistory } = useContext(PaymentContext);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTransactions(); // Call the fetchTransactions function here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Fetch data from the API here and update the state
    fetchTransactions();
  }, []);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/getlandlordpayments');
      const data = await response.json();
      setTransactions(data.payments);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView 
      style={styles.containerBig}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
      <View style={styles.horizontalPaddingView}>
        <View style={styles.container}>
          <View>
            <Text style={values.h1Style}>Hello, {name}</Text>
            <Text style={values.pStyle}>Welcome back to your wallet!</Text>
          </View>
          <Image style={styles.image} source={{ uri: avatar }} />
        </View>
        <View style={{ height: 20 }}></View>
        <SearchBar placeholder="Search" icon="search-outline" />
        <View style={{ height: 20 }}></View>
      </View>
      <View style={styles.horizontalPaddingView}>
        <View style={{ height: 20 }}></View>
        <Text style={values.h2Style}>Transactions History</Text>
        <View style={{ height: 20 }}></View>
        <FlatList
          data={transactions}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id} // Assuming the transaction objects have an "_id" property
          renderItem={({ item }) => <Transaction transaction={item} onPress={(val) => console.warn(`Clicked ${val}`)} />}
        />
        <View>
        </View>
      </View>
      <View style={{ height: 60 }}></View>
    </ScrollView>
  );
};

export default Payment;

const values = {
  horizontalPadding: 25,
  verticalPadding: 20,
  h1Style: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  h2Style: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pStyle: {
    color: 'grey',
    fontSize: 12,
  },
  pWhiteStyle: {
    color: 'white',
    fontSize: 12,
  },
};

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
    containerBig: {
        flex: 1,
        paddingTop: values.verticalPadding + 40,
        backgroundColor: 'white'
    },
    horizontalPaddingView: {
        paddingHorizontal: values.horizontalPadding,
    }
})

