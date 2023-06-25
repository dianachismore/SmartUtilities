import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const Footer = () => {
  const navigation = useNavigation();
  const { user, loading } = useSelector(state => state.auth);
  const [role, setRole] = useState(user.role);

  const admin = () => {
    console.log('rol', role);
  };

  return (
    <View
      style={{
        padding: 18,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >
      <TouchableOpacity
        onPress={() =>
          role === 'administrator'
            ? navigation.navigate('adminpage')
            : role === 'landlord'
            ? navigation.navigate('landlordpage')
            : navigation.navigate('payment')
        }
        testID="creditcard-button"
      >
        <Icon name="creditcard" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('home')} testID="home-button">
        <Icon name="home" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('profile')} testID="profile-button">
        <Icon name="user" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
