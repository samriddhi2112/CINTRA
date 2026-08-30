import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [isTakingPicture, setIsTakingPicture] = useState(false);

  const takePicture = async () => {
    console.log('================================');
    console.log('SCAN BUTTON WAS PRESSED');
    console.log('================================');

    if (isTakingPicture) {
      return;
    }

    if (!cameraRef.current) {
      Alert.alert(
        'Camera Not Ready',
        'The camera is not ready yet. Please wait a moment and try again.'
      );

      return;
    }

    try {
      setIsTakingPicture(true);

      console.log('Taking picture...');

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      console.log('PHOTO CAPTURED');
      console.log(photo);

      if (photo && photo.uri) {
        setCapturedImage(photo.uri);

        console.log('PHOTO URI:', photo.uri);
      }
    } catch (error) {
      console.error('Camera capture error:', error);

      Alert.alert(
        'Capture Failed',
        'Unable to capture the photo. Please try again.'
      );
    } finally {
      setIsTakingPicture(false);
    }
  };

  const retakePicture = () => {
    console.log('RETAKE BUTTON PRESSED');

    setCapturedImage(null);
  };

  const scanCapturedImage = () => {
    if (!capturedImage) {
      Alert.alert(
        'No Photo',
        'Please capture a photo before scanning.'
      );

      return;
    }

    /*
      TEMPORARY MOCK RESPONSE

      Later this will be replaced by:

      identifyFace(capturedImage)

      from services/api.js

      The response structure already matches
      Person 2's backend API contract.
    */

    const mockResponse = {
      match: true,
      suspect: {
        suspect_id: 'S001',
        name: 'Demo Suspect',
        role: 'Demo Role',
        confidence: 94.6,
        wanted: true,
      },
      message: 'Match Found',
    };

    navigation.navigate('Result', {
      response: mockResponse,
      capturedImage: capturedImage,
    });
  };

  // --------------------------------------------------
  // PERMISSION LOADING
  // --------------------------------------------------

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>
          Checking camera permission...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // PERMISSION NOT GRANTED
  // --------------------------------------------------

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>
          CINTRA Camera
        </Text>

        <Text style={styles.message}>
          CINTRA needs access to your camera to scan a person.
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // MAIN CAMERA SCREEN
  // --------------------------------------------------

  return (
    <View style={styles.container}>

      {/* Camera stays mounted */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="picture"
      />

      {/* Captured photo */}
      {capturedImage && (
        <Image
          source={{ uri: capturedImage }}
          style={styles.capturedImage}
          resizeMode="cover"
        />
      )}

      {/* Top section */}
      <View style={styles.topSection}>

        <Text style={styles.header}>
          CINTRA
        </Text>

        <Text style={styles.instruction}>
          {capturedImage
            ? 'Photo captured successfully'
            : "Position the person's face inside the frame"}
        </Text>

      </View>

      {/* Face frame */}
      {!capturedImage && (
        <View style={styles.scanFrame} />
      )}

      {/* Bottom buttons */}
      <View style={styles.bottomSection}>

        {capturedImage ? (

          <View style={styles.buttonRow}>

            {/* Retake */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={retakePicture}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>
                RETAKE
              </Text>
            </TouchableOpacity>

            {/* Scan */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={scanCapturedImage}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>
                IDENTIFY
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          <TouchableOpacity
            style={[
              styles.scanButton,
              isTakingPicture && styles.disabledButton,
            ]}
            onPress={takePicture}
            disabled={isTakingPicture}
            activeOpacity={0.7}
          >
            <Text style={styles.scanButtonText}>
              {isTakingPicture
                ? 'CAPTURING...'
                : 'SCAN'}
            </Text>
          </TouchableOpacity>

        )}

      </View>

    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  capturedImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  topSection: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  instruction: {
    marginTop: 15,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },

  scanFrame: {
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
    width: 260,
    height: 320,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 15,
    zIndex: 5,
  },

  bottomSection: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },

  scanButton: {
    width: 170,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  primaryButton: {
    width: 150,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  secondaryButton: {
    width: 130,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  permissionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});