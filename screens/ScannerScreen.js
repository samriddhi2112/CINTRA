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

    if (!cameraRef.current) {
      console.log('ERROR: Camera reference is null');

      Alert.alert(
        'Camera Not Ready',
        'The camera is not ready yet. Please wait a moment and try again.'
      );

      return;
    }

    console.log('Camera reference exists.');
    console.log('Starting photo capture...');

    try {
      setIsTakingPicture(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      console.log('PHOTO CAPTURED');
      console.log(photo);

      if (photo && photo.uri) {
        console.log('PHOTO URI:', photo.uri);
        setCapturedImage(photo.uri);
      } else {
        console.log('ERROR: No photo URI returned');

        Alert.alert(
          'Capture Error',
          'The camera did not return a photo.'
        );
      }
    } catch (error) {
      console.log('================================');
      console.log('CAMERA ERROR');
      console.log(error);
      console.log('================================');

      Alert.alert(
        'Camera Error',
        'Something went wrong while taking the picture.'
      );
    } finally {
      setIsTakingPicture(false);
    }
  };

  const retakePicture = () => {
    console.log('RETAKE BUTTON PRESSED');
    setCapturedImage(null);
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

      {/* CAMERA */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="picture"
      />

      {/* CAPTURED IMAGE */}
      {capturedImage && (
        <Image
          source={{ uri: capturedImage }}
          style={styles.capturedImage}
          resizeMode="cover"
        />
      )}

      {/* TOP INFORMATION */}
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

      {/* SCAN FRAME */}
      {!capturedImage && (
        <View style={styles.scanFrame} />
      )}

      {/* BOTTOM BUTTON */}
      <View style={styles.bottomSection}>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={capturedImage ? retakePicture : takePicture}
          disabled={isTakingPicture}
          activeOpacity={0.5}
        >
          <Text style={styles.scanButtonText}>
            {isTakingPicture
              ? 'CAPTURING...'
              : capturedImage
              ? 'RETAKE'
              : 'SCAN'}
          </Text>
        </TouchableOpacity>

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

  scanButton: {
    width: 170,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

    // Make the button very obviously clickable
    elevation: 10,
  },

  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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