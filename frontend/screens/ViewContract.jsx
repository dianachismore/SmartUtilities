import React, { useContext, useEffect, useState} from 'react';
import {View,Text, StyleSheet, ScrollView} from 'react-native'
import { ContractContext } from '../components/ContractContext'
const ViewContract = () => {
  const [contract, setContract] = useState(null)


  useEffect(() => {
    const fetchContract = async () => {
      try {
        // Make the HTTP GET request to the controller endpoint
        const response = await fetch('http://127.0.0.1:5000/api/v1/getusercontract');
        const data = await response.json();
        if (response.ok) {
          setContract(data);
        } else {
          console.log('Error:', data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch contract data initially
    fetchContract();

    // Re-fetch contract data every second
    const intervalId = setInterval(fetchContract, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);


  return (
    <ScrollView style={Styles.container}>
      {contract ?
      <>
      <Text style={Styles.header}>CONTRACT DE ÎNCHIRIERE</Text>
      <Text style={Styles.data}>{contract.dataInchiriere.substring(0, 10)}</Text>
      <View style={{height:30}}></View>
      <Text style={Styles.title}>PĂRȚILE CONTRACTANTE</Text>
      <View style={Styles.containerText}>
        <Text style={Styles.text}>
          <Text style={Styles.data}>{contract.numeProprietar} </Text>
          <Text style={Styles.data}>{contract.prenumeProprietar} </Text>
           domiciliat in 
          <Text style={Styles.data}> {contract.domiciliuProprietar} </Text>
          identificat cu CI, seria
          <Text style={Styles.data}> {contract.serieIdProprietar} </Text>
           nr 
          <Text style={Styles.data}> {contract.nrIdProprietar} </Text>
           in calitate de PROPRIETAR si 
          <Text style={Styles.data}> {contract.numeChirias}  </Text>
          <Text style={Styles.data}>{contract.prenumeChirias} </Text>
           domiciliat in 
          <Text style={Styles.data}> {contract.domiciliuChirias} </Text>
          identificat cu CI, seria
          <Text style={Styles.data}> {contract.serieIdChirias} </Text>
           nr 
          <Text style={Styles.data}> {contract.nrIdChirias} </Text>
           in calitate de CHIRIAS au convenit încheierea prezentului contract de închiriere cu respectarea clauzelor de mai jos.
        </Text>
      </View>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Între părțile mai sus menționate intervine prezentul contract de închiriere în următoarele condiții: </Text>
      </View>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> 
          Art. 1. Proprietarul asigură chiriașului folosirea spațiului situat în 
          <Text style={Styles.data}> {contract.adresaApartament}</Text>
          . Obiectul închirierii este format din
          <Text style={Styles.data}> {contract.componenteApartament}.</Text>
        </Text>
      </View>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 2. Bunul închiriat nu este grevat de sarcini.</Text>
      </View>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 3. Proprietarul predă chiriașului bunul închiriat la data de:
          <Text style={Styles.data}> {contract.dataInchiriere.substring(0, 10)}.</Text>
        </Text>
      </View>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 4. Proprietarul predă chiriașului bunul închiriat în stare
          <Text style={Styles.data}> {contract.stareApartament}.</Text>
        </Text>
      </View>
      <View style={{height:30}}></View>
      <Text style={Styles.title}>PREȚUL ÎNCHIRIERII</Text>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 5. Prețul închirierii, respectiv chiria este de
          <Text style={Styles.data}> {contract.sumaChirie}.</Text>
        </Text>
      </View>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 6. Cuantumul chiriei va putea fi modificat de către părți, prin acord, pe baza de act adițional la prezentul contract.</Text>
      </View>
      <View style={{height:30}}></View>
      <Text style={Styles.title}>DURATA CONTRACTULUI DE ÎNCHIRIERE</Text>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 7. Prezentul contract de închiriere se încheie la data
          <Text style={Styles.data}> {contract.dataFinal.substring(0, 10)}.</Text>
        </Text>
      </View>    
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 8. Prezentul contract de închiriere poate înceta și înainte de data sus menționată prin acordul scris al ambelor părți.</Text>
      </View> 
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 9. Prezentul contract de închiriere va putea fi prelungit prin acordul scris al ambelor părți până la data expirării prezentului contract și cu anunțarea părților cu minim 30 zile în avans. </Text>
      </View> 
      <View style={{height:30}}></View>
      <Text style={Styles.title}>LITIGII</Text>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> Art. 10. Eventualele litigii care s-ar putea ivi în legătură cu acest contractor pot fi soluționate pe cale amiabila, iar dacă părțile nu cad de acord vor fi soluționate de instanțele de judecată competente.</Text>
      </View> 
      <View style={{height:30}}></View>
      <Text style={Styles.title}>ALTE CAUZE</Text>
      <View style={Styles.containerText}>
        <Text style={Styles.text}> 
        Prezentul contract de închiriere intră în vigoare la data de
        <Text style={Styles.data}> {contract.dataFinal.substring(0, 10)}.</Text>
        Acest contract are ca temei dispozițiile legislației în vigoare.
        Contractul și anexa au fost încheiate în 2 exemplare originale, unul pentru fiecare parte contractantă.
        </Text>
      </View> 
      <View style={{height:50}}>
      </View>
      </>
      : <Text>'Loading contract...'</Text>}
    </ScrollView>
  );
};

export default ViewContract;


const Styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    padding:20,
    paddingTop: 30,
    paddingBottom:100,
  },
  header:{
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title:{
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  data:{
    color:'blue',
    fontSize: 14,
  },
  containerText: {
    flexDirection: 'row', // Arrange items horizontally
    flexWrap: 'wrap', // Wrap text to the next line if needed
    marginVertical: 5
  },
  text: {
    fontSize: 14,
    marginVertical: 4
  },
});