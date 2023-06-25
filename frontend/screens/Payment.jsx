import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, ScrollView,RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { categories, transactions, transfer } from '../components/Data';
import Category from '../components/Cathegory';
import SearchBar from '../components/SearchBar';
import Transaction from '../components/Transaction';
import { PaymentContext } from '../components/PaymentContext';

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

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/getpayments');
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
        <Text style={values.h2Style}>Payment</Text>
        <View style={{ height: 20 }}></View>
        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Category category={item} />}
        />
      </View>
      <View style={styles.horizontalPaddingView}>
        <View style={{ height: 20 }}></View>
        <Text style={values.h2Style}>Transactions History</Text>
        <View style={{ height: 20 }}></View>
        {/* <FlatList
          data={transactions}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Transaction transaction={item} onPress={(val) => console.warn(`Clicked ${val}`)} />}
          contentContainerStyle={{ flexGrow: 1 }}
        /> */}
        <FlatList
      data={transactions}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id} // Assuming the transaction objects have an "_id" property
      renderItem={({ item }) => <Transaction transaction={item} onPress={(val) => console.warn(`Clicked ${val}`)} />}
    />
        <View>
          {/* <Text>Payment History:</Text>
          {paymentHistory.reverse().map((payment, index) => (
            <View key={index}>
              <Text>Amount: {payment.amount}</Text>
              <Text>Date: {payment.date.toString()}</Text>
            </View>
          ))} */}
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

