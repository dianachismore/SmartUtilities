import React, { useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from './screens/Home'
import Login from './screens/Login'
import Footer from './components/Footer'
import Profile from "./screens/Profile"
import Payment from "./screens/Payment"
import Register from "./screens/Register"
import Camera from "./screens/Camera"
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './redux/action'
import Loader from "./components/Loader"
import ChangePassword from './screens/ChangePassword'
import Verify from './screens/Verify'
import ForgetPassword from './screens/ForgetPassword'
import ResetPassword from './screens/ResetPassword'
import AddPost from './screens/AddPost'
import PayYourRent from './screens/PayYourRent'
import PayYourUtilities from './screens/PayYourUtilities'
import AdminDashboard from './screens/AdminDashboard'
import AdminPage from './screens/AdminPage';
import AdminTransactionHistory from './screens/AdminTransactionHistory';
import ViewContract from './screens/ViewContract'
import ScanLandlordId from './screens/ScanLandlordId'
import ScanRenterId from './screens/ScanRenterId'
import GenerateContract from './screens/GenerateContract'
import AddCard from './screens/AddCard'
import StripeGateway from './components/StripeGateway'
import StripeRentGateway from './components/StripeRentGateway'
import AsyncStorage from "@react-native-async-storage/async-storage";
import LandlordPage from './screens/LandlordPage';
const Stack = createNativeStackNavigator()

const Main = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadUser())

    }, [dispatch])


    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

    const { isAuthenticated, loading } = useSelector(state => state.auth)
    return (
        loading ? <Loader /> : <NavigationContainer>

            <Stack.Navigator initialRouteName={isAuthenticated ? "home" : "login"}>
                <Stack.Screen name='home' component={Home} options={{ headerShown: false }} />
                <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='register' component={Register} options={{ headerShown: false }} />
                <Stack.Screen name='verify' component={Verify} options={{ headerShown: false }} />
                <Stack.Screen name='camera' component={Camera} options={{ headerShown: false }} />
                <Stack.Screen name='profile' component={Profile} options={{ headerShown: false }} />
                <Stack.Screen name='changepassword' component={ChangePassword} options={{ headerShown: false }} />
                <Stack.Screen name='forgetpassword' component={ForgetPassword} options={{ headerShown: false }} />
                <Stack.Screen name='resetpassword' component={ResetPassword} options={{ headerShown: false }} />
                <Stack.Screen name='payment' component={Payment} options={{ headerShown: false }} />
                <Stack.Screen name='addpost' component={AddPost} options={{ headerShown: false }} />
                <Stack.Screen name='payrent' component={PayYourRent} options={{ headerShown: false }} />
                <Stack.Screen name='payutilities' component={PayYourUtilities} options={{ headerShown: false }} />
                <Stack.Screen name='admindashboard' component={AdminDashboard} options={{ headerShown: false }} />
                <Stack.Screen name='adminpage' component={AdminPage} options={{ headerShown: false }} />
                <Stack.Screen name='viewcontract' component={ViewContract} options={{ headerShown: false }} />
                <Stack.Screen name='scanlandlordid' component={ScanLandlordId} options={{ headerShown: false }} />
                <Stack.Screen name='scanrenterid' component={ScanRenterId} options={{ headerShown: false }} />
                <Stack.Screen name='generatecontract' component={GenerateContract} options={{ headerShown: false }} />
                <Stack.Screen name='addcard' component={AddCard} options={{ headerShown: false }} />
                <Stack.Screen name='stripegateway' component={StripeGateway} options={{ headerShown: false }} />
                <Stack.Screen name='striperentgateway' component={StripeRentGateway} options={{ headerShown: false }} />
                <Stack.Screen name='landlordpage' component={LandlordPage} options={{ headerShown: false }} />
                <Stack.Screen name='admintransactionhistory' component={AdminTransactionHistory} options={{ headerShown: false }} />
            </Stack.Navigator>

            {isAuthenticated && <Footer />}

            
        </NavigationContainer>
    )
}

export default Main