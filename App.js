import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import HomeScreen from './screens/HomeScreen';
import CaptureEvidenceScreen from './screens/CaptureEvidenceScreen';
import FaceMatchResultScreen from './screens/FaceMatchResultScreen';
import DatabaseSearchScreen from './screens/DatabaseSearchScreen';
import EvidenceUploadScreen from './screens/EvidenceUploadScreen';
import EvidenceTypeScreen from './screens/EvidenceTypeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="OTP"
          component={OTPScreen}
        />

        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="CaptureEvidence" component={CaptureEvidenceScreen} />
<Stack.Screen name="FaceMatchResult" component={FaceMatchResultScreen} />
<Stack.Screen name="DatabaseSearch" component={DatabaseSearchScreen} />
<Stack.Screen name="EvidenceUpload" component={EvidenceUploadScreen} />
<Stack.Screen name="EvidenceType" component={EvidenceTypeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}