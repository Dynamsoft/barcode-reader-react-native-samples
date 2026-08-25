/*
 * This is the sample of Dynamsoft Barcode Reader.
 *
 * Copyright © Dynamsoft Corporation. All rights reserved.
 */

import React from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CameraScreen from './CameraScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: { mode: 'scan' | 'search'; targetText?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: true,
            headerTitle: 'Locate Item',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#333' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
