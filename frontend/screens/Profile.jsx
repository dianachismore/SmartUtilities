import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, logout, updateProfile } from '../redux/action'
import mime from "mime"
import Loader from '../components/Loader'

const Profile = ({ navigation, route }) => {
    const { message, error } = useSelector(state => state.message)
    const { user, loading } = useSelector(state => state.auth)
    const role = user.role
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar.url);

    const dispatch = useDispatch()

    const submitHandler = async () => {
        const myForm = new FormData();
        myForm.append("name", name);
        myForm.append("avatar", {
            uri: avatar,
            type: mime.getType(avatar),
            name: avatar.split("/").pop()
        })
        await dispatch(updateProfile(myForm));
        dispatch(loadUser())
        navigation.navigate("home")
    }

    const viewContractHandler = async () => {
        navigation.navigate("viewcontract")
    }

    const generateContractHandler = async () => {
        navigation.navigate("scanlandlordid")
    }
    const handleImage = () => {
        navigation.navigate("camera", {
            updateProfile: true
        })
    };

    const logoutHandler = () => {
        dispatch(logout())
    }


    useEffect(() => {
        if (route.params) {
            if (route.params.image) {
                setAvatar(route.params.image)
            }
        }

    }, [route])

    useEffect(() => {
        if (message) {
            alert(message);
            dispatch({ type: "clearMessage" })
        }
        if (error) {
            alert(error);
            dispatch({ type: "clearError" })
        }
    }, [alert, message, dispatch, error])

    return (
        
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Avatar.Image
                    size={100}
                    source={{ uri: avatar ? avatar : null }}
                    style={{ backgroundColor: "#900" }}
                />
                <TouchableOpacity onPress={handleImage}>
                    <Text style={{ color: "#900", margin: 20 }}>Change Photo</Text>
                </TouchableOpacity>

                <View style={{ width: "70%" }}>
                    <TextInput
                        style={Styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />

                </View>

                <Button
                    style={Styles.btn}
                    onPress={submitHandler}
                >
                    <Text style={{ color: "#fff" }}>Update</Text>
                </Button>

                <Button
                    color='rgb(50,50,50)'
                    onPress={() => navigation.navigate("changepassword")}
                >
                    Change Password
                </Button>

                <Button
                    color='rgb(50,50,50)'
                    onPress={logoutHandler}
                >
                    Logout
                </Button>

                {
                    user.verified ? null : <Button
                        onPress={() => navigation.navigate("verify")}
                    >
                        Verify
                    </Button>
                }

                <Button
                    color='rgb(50,50,50)'
                    onPress={viewContractHandler}
                >
                    View Contract
                </Button>
                {role === 'landlord' ?  
                (
                    <Button
                        color='rgb(50,50,50)'
                        onPress={generateContractHandler}
                    >
                        Generate Contract
                    </Button>
                )
                : null}
            </View>
        
    )
}

export default Profile

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
});