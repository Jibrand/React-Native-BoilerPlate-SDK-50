import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import LoadingScreen from './Screen/Loading/Loading';
import Home from './Screen/Medicine/Home';
import AddMedicine from './Screen/Medicine/AddMedicine';
import { RootSiblingParent } from 'react-native-root-siblings';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="AddMedicine" component={AddMedicine} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};

export default App;
