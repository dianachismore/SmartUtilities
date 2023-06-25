import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper'
import { ContractContext } from '../components/ContractContext'
import axios from 'axios'

const Background = ({ children }) => {
  return (
    <View>
      <ImageBackground source={require("../assets/generate_contract.jpg")} style={{ height: '80%'}} />
      <View style={{ position: "absolute", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {children}
      </View>
    </View>
  );
}

const GenerateContract = ({ navigation, route }) => {
  const [adresaApartament, setAdresaApartament] = useState('');
  const [componenteApartament, setComponenteApartament] = useState('');
  const [stareApartament, setStareApartament] = useState('');
  const stari = [
    { label: 'Nou', value: 'nou' },
    { label: 'Renovat', value: 'renovat' },
    { label: 'Mobilat', value: 'mobilat' },
    { label: 'Nemobilat', value: 'nemobilat' },
    { label: 'Deteliorat', value: 'deteliorat' },
    { label: 'Vechi', value: 'vechi' },
  ];
  const [sumaChirie, setSumaChirie] = useState('');
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [dataInchiriere, setDataInchiriere] = useState(null);
  const [isPickerShowFinal, setIsPickerShowFinal] = useState(false);
  const [dataFinal, setDataFinal] = useState(null);
  const { landlordIdData, renterIdData } = useContext(ContractContext);

  const handleSubmit = async () => {
    try {
      const contractData = {
        dataInchiriere: dataInchiriere,
        adresaApartament: adresaApartament,
        componenteApartament: componenteApartament,
        stareApartament: stareApartament,
        dataFinal: dataFinal,
        sumaChirie: sumaChirie,
        numeProprietar: landlordIdData.nume,
        prenumeProprietar: landlordIdData.prenume,
        domiciliuProprietar: landlordIdData.domiciliu,
        serieIdProprietar: landlordIdData.serieBuletin,
        nrIdProprietar: landlordIdData.nrBuletin,
        numeChirias: renterIdData.numeChirias,
        prenumeChirias: renterIdData.prenumeChirias,
        domiciliuChirias: renterIdData.domiciliuChirias,
        serieIdChirias: renterIdData.serieBuletinChirias,
        nrIdChirias: renterIdData.nrBuletinChirias,
      };
      await axios.post('http://127.0.0.1:5000/api/v1/createcontract', contractData);
    } catch (error) {
      console.error(error);
    }
  };


  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dataInchiriere;
    const selectedDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    setDataInchiriere(selectedDateOnly);

    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };

  const showPickerFinal = () => {
    setIsPickerShowFinal(true);
  };

  const onChangeFinal = (event, selectedDate) => {
    const currentDate = selectedDate || dataFinal;
    const selectedDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    setDataFinal(selectedDateOnly);

    if (Platform.OS === 'android') {
      setIsPickerShowFinal(false);
    }
  };

  const next = async () => {
    navigation.navigate('viewcontract');
}
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
          }}
        >
          Complete the Contract
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginBottom: 40,
          }}
        >
          Enter Contract Details
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
          <View style={{ width: '70%' }}>
            <TextInput
              style={Styles.input}
              placeholder="Address"
              value={adresaApartament}
              onChangeText={setAdresaApartament}
            />
            <TextInput
              style={Styles.input}
              placeholder="Facilities"
              value={componenteApartament}
              onChangeText={setComponenteApartament}
            />
            <View style={Styles.twoInputsContainer}>
              <Dropdown
                style={Styles.dropdown}
                containerStyle={Styles.dropdownContainer}
                placeholderStyle={Styles.placeholder}
                data={stari}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Condition"
                value={stareApartament}
                onChange={(item) => {
                  setStareApartament(item.value);
                }}
              />
              <TextInput
                style={Styles.inputSmall}
                placeholder="Price"
                value={sumaChirie}
                onChangeText={setSumaChirie}
              />
            </View>

            <View style={Styles.twoInputsContainer}>
            {!isPickerShow && (
              <TouchableOpacity onPress={showPicker}>
                <Text style={[
                    Styles.inputSmall,
                    !dataInchiriere && Styles.placeholder,
                  ]}>
                  {dataInchiriere ? dataInchiriere.toDateString() : 'Rental Date'}
                </Text>
              </TouchableOpacity>
            )}
            {isPickerShow && (
              <DateTimePicker
                value={dataInchiriere || new Date()}
                mode="date"
                accentColor="#900"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChange}
              />
            )}
            {!isPickerShowFinal && (
              <TouchableOpacity onPress={showPickerFinal}>
                <Text style={[
                    Styles.inputSmall,
                    !dataFinal && Styles.placeholder,
                  ]}>
                  {dataFinal ? dataFinal.toDateString() : 'Final Date'}
                </Text>
              </TouchableOpacity>
            )}
            {isPickerShowFinal && (
              <DateTimePicker
                value={dataFinal || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeFinal}
              />
            )}
            </View>
          </View>
          <Button style={Styles.nextbtn} onPress={() => {
              handleSubmit();
              next();
            }}>
            <Text style={{ color: '#fff' }}>Next</Text>
          </Button>
        </View>
      </View>
    </Background>
  );
};

export default GenerateContract;

const Styles = StyleSheet.create({
  twoInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b5b5b5',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 15,
    marginVertical: 15,
    fontSize: 15,
    width: 300,
  },
  inputSmall: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b5b5b5',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 15,
    marginVertical: 15,
    fontSize: 15,
    width: 140,
  },
  dropdown: {
    padding: 10,
    marginVertical: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#b5b5b5',
    borderRadius: 15,
    width: 130,
  },
  dropdownContainer: {
    marginBottom: -140,
    borderWidth: 1,
    borderColor: '#b5b5b5',
    borderRadius: 15,
  },
  placeholder: {
    color: '#b5b5b5',
  },
  nextbtn:{
    backgroundColor: "#900",
    padding: 5,
    width: "20%",
    marginTop:5,
    marginLeft: 250,
  },
});
