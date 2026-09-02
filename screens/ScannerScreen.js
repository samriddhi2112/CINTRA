import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import {
  isAuthenticated,
  logout,
  getCurrentUser,
  updateActivity,
} from '../services/authService';

import { calculateSHA256 } from '../services/hashService';

import ForensicWatermark from '../components/ForensicWatermark';


export default function ScannerScreen({ navigation }) {

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const cameraRef = useRef(null);

  // Prevent session checker from running after manual logout
  const loggingOut = useRef(false);

  // Prevent repeated session-expired alerts
  const sessionExpiredShown = useRef(false);


  // Request/check camera permission
  useEffect(() => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);


  // Session monitoring
  useEffect(() => {

    const checkSession = () => {

      // User intentionally logged out
      if (loggingOut.current) {
        return;
      }

      // Session is still valid
      if (isAuthenticated()) {
        return;
      }

      // Prevent multiple expiration popups
      if (sessionExpiredShown.current) {
        return;
      }

      sessionExpiredShown.current = true;

      Alert.alert(
        'Session Expired',
        'You have been logged out due to inactivity.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Login');
            },
          },
        ],
        {
          cancelable: false,
        }
      );
    };


    // Check immediately
    checkSession();

    // Then check every second
    const interval = setInterval(checkSession, 1000);


    // IMPORTANT:
    // Stop the interval when ScannerScreen is removed
    return () => {
      clearInterval(interval);
    };

  }, [navigation]);


  // Update activity whenever user interacts with the scanner
  const handleScreenActivity = () => {

    if (loggingOut.current) {
      return;
    }

    if (isAuthenticated()) {
      updateActivity();
    }
  };


  // Capture evidence
  const handleCapture = async () => {

    handleScreenActivity();

    if (!isAuthenticated()) {
      return;
    }

    if (!cameraRef.current) {
      Alert.alert(
        'Camera Error',
        'Camera is not ready.'
      );
      return;
    }

    if (!cameraReady) {
      Alert.alert(
        'Camera Not Ready',
        'Please wait for the camera to initialize.'
      );
      return;
    }

    if (capturing) {
      return;
    }


    try {

      setCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
      });


      if (!photo || !photo.uri) {
        throw new Error('No photo was captured.');
      }


      // Generate SHA-256 hash
      const sha256 = await calculateSHA256(photo.uri);


      const currentUser = getCurrentUser();


      // Create evidence metadata
      const evidence = {
        uri: photo.uri,
        sha256: sha256,
        badgeId: currentUser?.badgeId || 'Unknown',
        capturedAt: new Date().toISOString(),
      };


      // Send evidence to Result screen
      navigation.navigate('Result', {
        evidence: evidence,
      });

    } catch (error) {

      console.error('Evidence capture error:', error);

      Alert.alert(
        'Capture Failed',
        'Unable to capture or process the evidence.'
      );

    } finally {

      setCapturing(false);

    }
  };


  // Manual logout
  const handleLogout = () => {

    // VERY IMPORTANT:
    // Tell the session checker that this is intentional logout
    loggingOut.current = true;

    // Prevent any expiration popup
    sessionExpiredShown.current = true;

    // Clear authentication
    logout();

    // Go directly to Login
    navigation.replace('Login');
  };


  // Camera permission still loading
  if (!permission) {

    return (
      <View style={styles.centerContainer}>

        <ActivityIndicator size="large" />

        <Text style={styles.message}>
          Checking camera permission...
        </Text>

      </View>
    );
  }


  // Camera permission denied
  if (!permission.granted) {

    return (
      <View style={styles.centerContainer}>

        <Text style={styles.message}>
          Camera permission is required to capture evidence.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >

          <Text style={styles.buttonText}>
            GRANT CAMERA PERMISSION
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

      </View>
    );
  }


  return (
    <View
      style={styles.container}
      onTouchStart={handleScreenActivity}
    >

      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      >

        {/* Forensic watermark */}
        <ForensicWatermark
          badgeId={getCurrentUser()?.badgeId}
        />

      </CameraView>


      {/* Bottom controls */}
      <View style={styles.controls}>

        <Text style={styles.title}>
          CINTRA EVIDENCE SCANNER
        </Text>


        <TouchableOpacity
          style={[
            styles.captureButton,
            (!cameraReady || capturing) &&
              styles.disabledButton,
          ]}
          onPress={handleCapture}
          disabled={!cameraReady || capturing}
        >

          <Text style={styles.buttonText}>
            {capturing
              ? 'PROCESSING...'
              : 'CAPTURE EVIDENCE'}
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

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  controls: {
    padding: 20,
    backgroundColor: '#111',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  captureButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutButton: {
    backgroundColor: '#b91c1c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
  },

});

