import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { validateBadgeId } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [badgeId, setBadgeId] = useState('');
  const handleLogin = () => {
  const cleanedBadgeId = badgeId.trim();

  if (!cleanedBadgeId) {
    Alert.alert('Badge ID Required', 'Please enter your Badge ID.');
    return;
  }

  if (!validateBadgeId(cleanedBadgeId)) {
    Alert.alert('Access Denied', 'Invalid Badge ID.');
    return;
  }

  navigation.navigate('OTP', {
    badgeId: cleanedBadgeId,
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CINTRA</Text>

      <Text style={styles.subtitle}>Officer Login</Text>

    <TextInput
  style={styles.input}
  placeholder="Enter Badge ID"
  placeholderTextColor="#888"
  value={badgeId}
  onChangeText={setBadgeId}
  autoCapitalize="characters"
/>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 20,
    marginBottom: 30,
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