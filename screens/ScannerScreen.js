import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { identifyFace } from '../services/api';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);

  // --------------------------------------------------
  // TAKE PHOTO
  // --------------------------------------------------

  const takePicture = async () => {
    console.log('================================');
    console.log('SCAN BUTTON WAS PRESSED');
    console.log('================================');

    if (isTakingPicture || isIdentifying) {
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

  // --------------------------------------------------
  // RETAKE PHOTO
  // --------------------------------------------------

  const retakePicture = () => {
    console.log('RETAKE BUTTON PRESSED');

    if (isIdentifying) {
      return;
    }

    setCapturedImage(null);
  };

  // --------------------------------------------------
  // SEND PHOTO TO BACKEND
  // --------------------------------------------------

  const scanCapturedImage = async () => {
    if (!capturedImage) {
      Alert.alert(
        'No Photo',
        'Please capture a photo before scanning.'
      );

      return;
    }

    if (isIdentifying) {
      return;
    }

    try {
      setIsIdentifying(true);

      console.log('================================');
      console.log('IDENTIFY BUTTON WAS PRESSED');
      console.log('================================');

      console.log('Sending image to backend...');
      console.log('Image URI:', capturedImage);

      const response = await identifyFace(capturedImage);

      console.log('BACKEND RESPONSE:');
      console.log(response);

      /*
        IMPORTANT:

        We use response.match to determine whether
        the person was matched.

        We do NOT check:
        response.message === "Match Found"
      */

      navigation.navigate('Result', {
        response: response,
        capturedImage: capturedImage,
      });

    } catch (error) {
      console.log('[CINTRA Scanner] Identification response:', error.message);

      Alert.alert(
        'Identification Result',
        error.message ||
          'Could not connect to the identification server.'
      );
    } finally {
      setIsIdentifying(false);
    }
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

      {/* Live camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="picture"
      />

      {/* Captured image */}
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
          {isIdentifying
            ? 'Identifying...'
            : capturedImage
            ? 'Photo captured successfully'
            : "Position the person's face inside the frame"}
        </Text>

      </View>

      {/* Face frame */}
      {!capturedImage && (
        <View style={styles.scanFrame} />
      )}

      {/* Identification loading overlay */}
      {isIdentifying && (
        <View style={styles.loadingOverlay}>

          <View style={styles.loadingCard}>

            <ActivityIndicator
              size="large"
              color="#000"
            />

            <Text style={styles.loadingTitle}>
              IDENTIFYING
            </Text>

            <Text style={styles.loadingMessage}>
              Please wait while CINTRA processes the image.
            </Text>

          </View>

        </View>
      )}

      {/* Bottom buttons */}
      <View style={styles.bottomSection}>

        {capturedImage ? (

          <View style={styles.buttonRow}>

            {/* Retake */}
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isIdentifying && styles.disabledButton,
              ]}
              onPress={retakePicture}
              disabled={isIdentifying}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>
                RETAKE
              </Text>
            </TouchableOpacity>

            {/* Identify */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isIdentifying && styles.disabledButton,
              ]}
              onPress={scanCapturedImage}
              disabled={isIdentifying}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>
                {isIdentifying
                  ? 'IDENTIFYING...'
                  : 'IDENTIFY'}
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

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },

  loadingCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },

  loadingTitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  loadingMessage: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },

});