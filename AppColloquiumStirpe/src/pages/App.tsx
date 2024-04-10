import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import type {Routes} from './Routes';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {Camera} from 'react-native-vision-camera';

import PermissionsPage from './PermissionsPage';
import CodeScannerPage from './CodeScannerPage';
import HomePage from './HomePage';
import Cadastrar from './Cadastrar';
import CadastrarItem from './CadastrarItem';
import CadastrarCor from './CadastrarCor';
import SecaoPage from './SecaoPage';

const Stack = createNativeStackNavigator<Routes>();

const App = (): React.ReactElement | null => {
  const cameraPermission = Camera.getCameraPermissionStatus();
  const microphonePermission = Camera.getMicrophonePermissionStatus();

  const showPermissionsPage =
    cameraPermission !== 'granted' || microphonePermission === 'not-determined';

  return (
    <NavigationContainer>
      <GestureHandlerRootView style={styles.root}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            statusBarStyle: 'dark',
            animationTypeForReplace: 'push',
          }}
          initialRouteName={
            showPermissionsPage ? 'PermissionsPage' : 'HomePage'
          }>
          <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="CodeScannerPage" component={CodeScannerPage} />
          <Stack.Screen name="Cadastrar" component={Cadastrar} />
          <Stack.Screen name="CadastrarItem" component={CadastrarItem} />
          <Stack.Screen name="CadastrarCor" component={CadastrarCor} />
          <Stack.Screen name="SecaoPage" component={SecaoPage} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
