import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import {
  verifySHA256,
} from '../services/hashService';

import {
  logout,
  getCurrentUser,
  updateActivity,
} from '../services/authService';

import ForensicWatermark from '../components/ForensicWatermark';

export default function ResultScreen({ navigation, route }) {
  const [verifying, setVerifying] = useState(false);

  const evidence = route?.params?.evidence;

  const handleVerifyIntegrity = async () => {
    updateActivity();

    if (!evidence?.uri || !evidence?.sha256) {
      Alert.alert(
        'Verification Failed',
        'Evidence data or SHA-256 hash is missing.'
      );
      return;
    }

    try {
      setVerifying(true);

      const result = await verifySHA256(
        evidence.uri,
        evidence.sha256
      );

      if (result.verified) {
        Alert.alert(
          'Integrity Verified',
          'The evidence file has not been modified.'
        );
      } else {
        Alert.alert(
          'Integrity Warning',
          'The evidence file may have been modified.'
        );
      }
    } catch (error) {
      console.error('Integrity verification error:', error);

      Alert.alert(
        'Verification Failed',
        'Unable to verify the evidence integrity.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleCaptureNew = () => {
    updateActivity();
    navigation.navigate('Scanner');
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const currentUser = getCurrentUser();

  if (!evidence) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          No evidence data available.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Scanner')}
        >
          <Text style={styles.buttonText}>
            RETURN TO SCANNER
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        EVIDENCE RESULT
      </Text>

      <Image
        source={{ uri: evidence.uri }}
        style={styles.image}
      />

      <View style={styles.infoBox}>
        <Text style={styles.label}>
          Officer Badge ID
        </Text>

        <Text style={styles.value}>
          {evidence.badgeId}
        </Text>

        <Text style={styles.label}>
          Captured At
        </Text>

        <Text style={styles.value}>
          {new Date(evidence.capturedAt).toLocaleString()}
        </Text>

        <Text style={styles.label}>
          SHA-256 Hash
        </Text>

        <Text
          style={styles.hash}
          selectable
        >
          {evidence.sha256}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          verifying && styles.disabledButton,
        ]}
        onPress={handleVerifyIntegrity}
        disabled={verifying}
      >
        <Text style={styles.buttonText}>
          {verifying
            ? 'VERIFYING...'
            : 'VERIFY INTEGRITY'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCaptureNew}
      >
        <Text style={styles.buttonText}>
          CAPTURE NEW EVIDENCE
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          LOGOUT
        </Text>
      </TouchableOpacity>

      <ForensicWatermark
        badgeId={
          evidence.badgeId ||
          currentUser?.badgeId
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  image: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },

  infoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 8,
  },

  value: {
    fontSize: 15,
    color: '#222',
    marginTop: 3,
  },

  hash: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    lineHeight: 18,
  },

  button: {
    width: '100%',
    minHeight: 50,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  logoutButton: {
    width: '100%',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  logoutText: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
  },

  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

