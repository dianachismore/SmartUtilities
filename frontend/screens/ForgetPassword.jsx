import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { forgetPassword } from '../redux/action';

const ForgetPassword = ({ navigation }) => {

    const [email, setEmail] = useState("");

    const { loading } = useSelector(state => state.message)

    const dispatch = useDispatch()

    const forgetHandler = async () => {
        await dispatch(forgetPassword(email))
        navigation.navigate("resetpassword")

    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text style={{ fontSize: 20, margin: 0 }}>FORGOT PASSWORD?</Text>
            <Text style={{ fontSize: 15, margin: 10, marginBottom: 20,color: '#9c9c9c', textAlign: 'center', width:250}}>Enter your email address and we'll send you a code to get back into your profile</Text>
            <View style={{ width: "70%" }}>
                <TextInput
                    style={Styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <Button
                style={Styles.btn}
                onPress={forgetHandler}
                color="#fff"
                disabled={loading}
                loading={loading}
            >
                Send Email
            </Button>



        </View>
    )
}




const Styles = StyleSheet.create({

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

export default ForgetPassword