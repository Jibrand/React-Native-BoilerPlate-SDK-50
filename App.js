import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './Screen/Loading/Loading';
import MainTabs from './Screen/MainTabs';
import { RootSiblingParent } from 'react-native-root-siblings';
import AddMedicine from './Screen/Explore/AddMedicine';
import MedSchedule from './Screen/Explore/MedSchedule';
import { MedicineProvider } from './Screen/MedicineContext';
import AdherenceMedicineList from './Screen/Explore/AdherenceMedicineList';
import Register from './Screen/Auth/Register';
import Login from './Screen/Auth/Login';
import SelectClinicScreen from './Screen/SelectClinicScreen/SelectClinicScreen';
import SearchDoctorScreen from './Screen/SelectClinicScreen/SearchDoctorScreen';
import TreatmentDetailScreen from './Screen/Explore/Treatment/TreatmentDetailScreen';
import Pending from './Screen/Auth/Pending';
import ProfileTab from './Screen/Profile/ProfileTab';
import PersonalInfoScreen from './Screen/Profile/PersonalInfo';
import Timeline from './Screen/Explore/Timeline';
import { registerForPushNotificationsAsync } from './utils/notifications';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <MedicineProvider>
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="register" component={Register} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="pending" component={Pending} />
            <Stack.Screen name="selectclinicscreen" component={SelectClinicScreen} />
            <Stack.Screen name="searchdoctorscreen" component={SearchDoctorScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="addmedicine" component={AddMedicine} />
            <Stack.Screen name="detailsscreen" component={TreatmentDetailScreen} />
            <Stack.Screen name="MedSchedule" component={MedSchedule} />
            <Stack.Screen name="AdherenceMedicineList" component={AdherenceMedicineList} />
            <Stack.Screen name="profiletab" component={ProfileTab} />
            <Stack.Screen name="personalinfo" component={PersonalInfoScreen} />
            <Stack.Screen name="Timeline" component={Timeline} />

          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </MedicineProvider>

  );
};

export default App;
