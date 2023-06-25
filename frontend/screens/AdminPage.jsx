import { StyleSheet, Text, View, Image , SafeAreaView, FlatList, ScrollView, Dimensions, TouchableOpacity, RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Category from '../components/Cathegory';
import SearchBar from '../components/SearchBar';
import Transaction from '../components/TransactionView';

const { width } = Dimensions.get("screen")
const Payment = ({ navigation, route }) => {
    const { user, loading } = useSelector(state => state.auth)
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar.url);
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
          // Make the API call to fetch the transactions data
          const response = await fetch('http://127.0.0.1:5000/api/v1/getallpayedutilities');
          const data = await response.json();
          console.log("1",data)
          // Update the state with the fetched data
          setTransactions(data);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <ScrollView 
            style={styles.containerBig} 
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.horizontalPaddingView}>
            <View style={styles.container}>
                <View>
                    <Text style={values.h1Style}>Hello, {name}</Text>
                    <Text style={values.pStyle}>See the latest payments</Text>
                </View>
                <Image style={styles.image} source={{ uri: avatar }} />
            </View>
             <TouchableOpacity style={styles.historyView} onPress={() => navigation.navigate('admintransactionhistory')}>
            <FlatList
                data={transactions}
                showsHorizontalScrollIndicator={false}
                horizontal ={true}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Transaction transaction={item} onPress={(val) => console.warn(`Clicked ${val}`)} />}
            />
        </TouchableOpacity>
        </View>
            <View style={styles.horizontalPaddingView}>
            <TouchableOpacity onPress={() => navigation.navigate('admindashboard')}>
                <View style={styles.box}>
                <Image style={styles.updateImage} source={require('../assets/admin_update.jpg')}/>
                    <Text style={styles.textOnPhoto}>Update the Payments for this Month</Text>
                </View>
            </TouchableOpacity>
            </View>
        <View style={{height: 60}}></View>
        </ScrollView>
    );
};

export default Payment

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
    box: {
        width: width * 0.87,
        height: 290,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30,
        marginTop: 25,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    textOnPhoto:{
        fontSize: 16,
        fontWeight: 'bold'
    },
    containerBig: {
        flex: 1,
        paddingTop: values.verticalPadding + 40,
        backgroundColor: 'white'
    },
    horizontalPaddingView: {
        paddingHorizontal: values.horizontalPadding,
    },
    historyView:{
        paddingTop: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
    },
    updateImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
})

