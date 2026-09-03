import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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

import { Ionicons } from '@expo/vector-icons';


export default function ScannerScreen({ navigation }) {

  const [permission, requestPermission] =
    useCameraPermissions();

  const [cameraReady, setCameraReady] =
    useState(false);

  const [capturedImage, setCapturedImage] =
    useState(null);

  const [capturedEvidence, setCapturedEvidence] =
    useState(null);

  const [isTakingPicture, setIsTakingPicture] =
    useState(false);

  const cameraRef = useRef(null);


  // --------------------------------------------------
  // CAMERA PERMISSION
  // --------------------------------------------------

  useEffect(() => {

    if (!permission) {
      return;
    }

    if (!permission.granted) {
      requestPermission();
    }

  }, [permission]);


  // --------------------------------------------------
  // TAKE PHOTO
  // --------------------------------------------------

  const takePicture = async () => {

    if (!isAuthenticated()) {
      return;
    }

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

    if (!cameraReady) {

      Alert.alert(
        'Camera Not Ready',
        'Please wait for the camera to initialize.'
      );

      return;
    }

    try {

      setIsTakingPicture(true);

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true,
        });

      if (!photo || !photo.uri) {
        throw new Error('No photo was captured.');
      }

      setCapturedImage(photo.uri);


      // Generate SHA-256 hash

      const sha256 =
        await calculateSHA256(photo.uri);


      // Get logged-in officer

      const currentUser =
        getCurrentUser();


      // Create evidence metadata

      const evidence = {

        uri: photo.uri,

        sha256: sha256,

        badgeId:
          currentUser?.badgeId ||
          'Unknown',

        capturedAt:
          new Date().toISOString(),

      };


      setCapturedEvidence(evidence);

      updateActivity();

    } catch (error) {

      console.error(
        'Camera capture error:',
        error
      );

      Alert.alert(
        'Capture Failed',
        'Unable to capture or process the evidence.'
      );

    } finally {

      setIsTakingPicture(false);

    }
  };


  // --------------------------------------------------
  // RETAKE PHOTO
  // --------------------------------------------------

  const retakePicture = () => {

    setCapturedImage(null);

    setCapturedEvidence(null);

    setCameraReady(false);

  };


  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {

    logout();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        },
      ],
    });

  };


  // --------------------------------------------------
  // PERMISSION LOADING
  // --------------------------------------------------

  if (!permission) {

    return (

      <View style={styles.centerContainer}>

        <ActivityIndicator
          size="large"
          color="#1976D2"
        />

        <Text style={styles.message}>
          Checking camera permission...
        </Text>

      </View>
    );
  }


  // --------------------------------------------------
  // PERMISSION DENIED
  // --------------------------------------------------

  if (!permission.granted) {

    return (

      <View style={styles.centerContainer}>

        <Ionicons
          name="camera"
          size={55}
          color="#1976D2"
        />

        <Text style={styles.title}>
          CINTRA Camera
        </Text>

        <Text style={styles.message}>
          Camera permission is required
          to capture evidence.
        </Text>


        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >

          <Ionicons
            name="camera"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            GRANT CAMERA PERMISSION
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out"
            size={21}
            color="#1976D2"
          />

          <Text style={styles.logoutText}>
            LOGOUT
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

      {/* Live Camera */}

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="picture"
        onCameraReady={() =>
          setCameraReady(true)
        }
      />


      {/* Captured Image */}

      {capturedImage && (

        <Image
          source={{
            uri: capturedImage,
          }}
          style={styles.capturedImage}
          resizeMode="cover"
        />

      )}


      {/* Forensic Watermark */}

      <ForensicWatermark
        badgeId={
          capturedEvidence?.badgeId ||
          getCurrentUser()?.badgeId
        }

        capturedAt={
          capturedEvidence?.capturedAt
        }
      />


      {/* Top Section */}

      <View style={styles.topSection}>

        <View style={styles.headerIcon}>

          <Ionicons
            name="shield-checkmark"
            size={24}
            color="#FFFFFF"
          />

        </View>

        <Text style={styles.header}>
          CINTRA
        </Text>

        <Text style={styles.instruction}>

          {capturedImage
            ? 'Photo captured successfully'
            : "Position the person's face inside the frame"}

        </Text>

      </View>


      {/* Face Frame */}

      {!capturedImage && (

        <View style={styles.scanFrame}>

          <View style={styles.cornerTopLeft} />

          <View style={styles.cornerTopRight} />

          <View style={styles.cornerBottomLeft} />

          <View style={styles.cornerBottomRight} />

        </View>

      )}


      {/* Bottom Controls */}

      <View style={styles.bottomSection}>

        {capturedImage ? (

          // Only RETAKE remains after capture

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={retakePicture}
            activeOpacity={0.7}
          >

            <Ionicons
              name="refresh"
              size={21}
              color="#1976D2"
            />

            <Text style={styles.secondaryButtonText}>
              RETAKE
            </Text>

          </TouchableOpacity>

        ) : (

          // SCAN / CAPTURE button

          <TouchableOpacity
            style={[
              styles.scanButton,
              (!cameraReady ||
                isTakingPicture) &&
                styles.disabledButton,
            ]}
            onPress={takePicture}
            disabled={
              !cameraReady ||
              isTakingPicture
            }
            activeOpacity={0.7}
          >

            <Ionicons
              name="camera"
              size={25}
              color="#FFFFFF"
            />

            <Text style={styles.scanButtonText}>

              {isTakingPicture
                ? 'CAPTURING...'
                : 'SCAN'}

            </Text>

          </TouchableOpacity>

        )}


        {/* Logout */}

        <TouchableOpacity
          style={styles.logoutButtonCamera}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.logoutTextCamera}>
            LOGOUT
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
    top: 45,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  instruction: {
    marginTop: 10,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontSize: 15,
    color: '#FFFFFF',
  },

  scanFrame: {
    position: 'absolute',
    top: '27%',
    alignSelf: 'center',
    width: 260,
    height: 320,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 15,
    zIndex: 5,
  },

  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 35,
    height: 35,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#1976D2',
  },

  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 35,
    height: 35,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#1976D2',
  },

  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 35,
    height: 35,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#1976D2',
  },

  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 35,
    height: 35,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#1976D2',
  },

  bottomSection: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },

  scanButton: {
    width: 180,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  secondaryButton: {
    width: 160,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  disabledButton: {
    opacity: 0.5,
  },

  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 7,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F5F7FA',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 15,
    color: '#1976D2',
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#555',
  },

  permissionButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  logoutButton: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#1976D2',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 7,
  },

  logoutButtonCamera: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutTextCamera: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },

});
