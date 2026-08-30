
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { verifyOTP } from '../services/authService';

export default function OTPScreen({ navigation, route }) {
  const [otp, setOtp] = useState('');
  const [attempts, setAttempts] = useState(0);

  const badgeId = route?.params?.badgeId;

  const handleVerify = () => {
    // Stop verification if the user has already used 3 attempts
    if (attempts >= 3) {
      Alert.alert(
        'Access Blocked',
        'Too many incorrect OTP attempts.'
      );
      return;
    }

    // OTP must contain exactly 6 digits
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert(
        'Invalid OTP',
        'OTP must contain exactly 6 digits.'
      );
      return;
    }

    // Check OTP using the authentication service
    if (!verifyOTP(otp)) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        Alert.alert(
          'Access Blocked',
          'Too many incorrect OTP attempts.'
        );
      } else {
        Alert.alert(
          'Incorrect OTP',
          `You have ${3 - newAttempts} attempt(s) remaining.`
        );
      }

      setOtp('');
      return;
    }

    // OTP is correct
    navigation.navigate('Scanner', {
      badgeId: badgeId,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to your registered device
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>VERIFY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

