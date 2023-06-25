import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground  } from 'react-native'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-native-paper'
import { scannId } from '../redux/action'
import mime from 'mime'
import axios from 'axios'
import GestureFlipView from 'react-native-gesture-flip-card';
import { ContractContext } from '../components/ContractContext'

const Background = ({ children }) => {
  return (
    <View>
      <ImageBackground source={require("../assets/scan_landlord.jpg")} style={{ height: '80%'}} />
      <View style={{ position: "absolute", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {children}
      </View>
    </View>
  );
}

const ScanLandlordId = ({ navigation, route }) => {
  const { landlordIdData, setLandlordIdData } = useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar.url);
  const [idImage, setIdImage] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [domiciliu, setDomiciliu] = useState('');
  const [nrBuletin, setNrBuletin] = useState('');
  const [nume, setNume] = useState('');
  const [prenume, setPrenume] = useState('');
  const [serieBuletin, setSerieBuletin] = useState('');

  const flipViewRef = useRef(null);

  const dispatch = useDispatch();

  const handleImage = () => {
    navigation.navigate('camera', {
      scanLandlordId: true,
    });
  };

  useEffect(() => {
    if (route.params) {
      if (route.params.image) {
        setIdImage(route.params.image);
      }
    }
  }, [route]);
  const scannIdHandler = async () => {
    const myForm = new FormData();
    myForm.append('document', {
      uri: idImage,
      type: mime.getType(idImage),
      name: idImage.split('/').pop(),
    });

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/scannid', {
        method: 'POST',
        body: myForm,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        setScannedData(data);
        setDomiciliu(data.domiciliu);
        setNrBuletin(data.nrBuletin);
        setNume(data.nume);
        setPrenume(data.prenume);
        setSerieBuletin(data.serieBuletin);
        flipViewRef.current.flipLeft();
      } else {
        console.log('HTTP request failed with status:', response.status);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error:', error);
    }
  };

  const handleSave =() => {
    setLandlordIdData({
      domiciliu,
      nrBuletin,
      nume,
      prenume,
      serieBuletin,
    });
  }
  const next = async () => {
    navigation.navigate('scanrenterid');
}

  const renderFront = () => {
    return (
      <View style={{ width: 400 }}>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleImage}>
          <View style={stylesChoosePhoto.container}>
            <Image style={stylesChoosePhoto.image} source={{ uri: idImage ? idImage : null }} />
            {!idImage && (
              <>
                <Image style={stylesChoosePhoto.icon} source={require('../assets/uploadImage.png')} />
                <Text style={values.h2Style}>Upload ID</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        <View style={{ height: 40 }}></View>
        <View style={{ alignItems: 'center' }}>
          <Button style={styles.btn} onPress={scannIdHandler} disabled={isLoading}>
            {isLoading ? (
              <Text style={{ color: '#fff' }}>Loading...</Text>
            ) : (
              <Text style={{ color: '#fff' }}>Scan ID</Text>
            )}
          </Button>
        </View>
      </View>
    );
  };

  const renderBack = () => {
    return (
      <View style={{ width: 400 }}>
        <View style={{ alignItems: 'center' }} onPress={handleImage}>
          <View style={stylesChoosePhoto.container}>
            <Image style={{ width: 300, height: 200, borderRadius: 15 }} source={require('../assets/buletintemplate.png')} />
            {scannedData && (
              <View style={stylesChoosePhoto.overlay}>
                <TextInput
                  style={stylesChoosePhoto.serieBuletin}
                  value={serieBuletin}
                  onChangeText={text => setSerieBuletin(text)}
                />
                <TextInput
                  style={stylesChoosePhoto.nrBuletin}
                  value={nrBuletin}
                  onChangeText={text => setNrBuletin(text)}
                />
                <TextInput
                  style={stylesChoosePhoto.numeBuletin}
                  value={nume}
                  onChangeText={text => setNume(text)}
                />
                <TextInput
                  style={stylesChoosePhoto.prenumeBuletin}
                  value={prenume}
                  onChangeText={text => setPrenume(text)}
                />
                <TextInput
                  style={stylesChoosePhoto.adresaBuletin}
                  value={domiciliu}
                  onChangeText={text => setDomiciliu(text)}
                />
              </View>
            )}
          </View>
        </View>
        <View style={{ height: 40 }}></View>
        <View style={{ flexDirection: 'row',justifyContent: 'space-between',width: 300, marginLeft: 50}}>
          <Button style={styles.btnSmall} onPress={() => flipViewRef.current.flipLeft()}>
            <Text style={{ color: '#fff' }}>Scan Again</Text>
          </Button>
          <Button style={styles.btnSmall} onPress={() => {next();handleSave()}}>
            <Text style={{ color: '#fff' }}>Next</Text>
          </Button>
        </View>
      </View>
    );
  };
  
  return (
    <Background>
    <View style={{ alignItems: 'center', width: 430 }}>
        <Text
          style={{
            color: 'white',
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 50,
            marginBottom: 20,
            marginRight:10
          }}
        >
          Start by Scanning
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginBottom: 40,
            marginRight:10
          }}
        >
          Your Personal ID
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 37,
            alignItems: 'center',
          }}
        >
        <View style={{ justifyContent: 'center', alignItems: 'center', width: 400, height: 350}}>
          <GestureFlipView width={300} height={500} ref={flipViewRef}>
            <View>{renderFront()}</View>
            <View>{renderBack()}</View>
          </GestureFlipView>
        </View>
      </View>
    </View>
  </Background>
  );
};

export default ScanLandlordId;

const stylesChoosePhoto = StyleSheet.create({
  container: {
    width: '75%',
    height: 200,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Add this line
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  icon: {
    width: 50,
    height: 50,
    marginTop: -200,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 15,
    padding: 5,
  },
  serieBuletin: {
    position: 'absolute',
    fontWeight:'bold',
    top:34,
    left:135,
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  nrBuletin: {
    position: 'absolute',
    fontWeight:'bold',
    top:34,
    left:200,
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  numeBuletin: {
    position: 'absolute',
    fontWeight:'bold',
    top:75,
    left:95,
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  prenumeBuletin: {
    position: 'absolute',
    fontWeight:'bold',
    top:115,
    left:95,
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  adresaBuletin: {
    position: 'absolute',
    fontWeight:'bold',
    top:165,
    left:10,
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

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
  },
  btn: {
    backgroundColor: "#900",
    padding: 5,
    width: "70%",
  },
  btnSmall:{
    backgroundColor: "#900",
    padding: 5,
    width: "45%",
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
})
