import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CaptureEvidenceScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#1976D2"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          CAPTURE & MATCH
        </Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Description */}
      <Text style={styles.instruction}>
        Capture a photo of a suspect or evidence
        to compare it with the criminal database.
      </Text>

      {/* Camera Area */}
      <View style={styles.cameraBox}>

        <View style={styles.cameraIconContainer}>
          <Ionicons
            name="camera"
            size={48}
            color="#1976D2"
          />
        </View>

        <Text style={styles.cameraTitle}>
          CAMERA PREVIEW
        </Text>

        <Text style={styles.cameraSubtitle}>
          Live face scanner is ready
        </Text>

      </View>

      {/* Capture Button */}
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Ionicons
          name="camera"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          CAPTURE PHOTO (SCANNER)
        </Text>
      </TouchableOpacity>

      {/* Match Button */}
      <TouchableOpacity
        style={styles.matchButton}
        onPress={() => navigation.navigate('FaceMatchResult')}
      >
        <Ionicons
          name="scan"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          MATCH WITH DATABASE
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 15,
    backgroundColor: '#F5F7FA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1976D2',
    letterSpacing: 1,
  },

  instruction: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  cameraBox: {
    height: 330,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginBottom: 22,
  },

  cameraIconContainer: {
    width: 85,
    height: 85,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  cameraTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },

  cameraSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },

  captureButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  matchButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 9,
    letterSpacing: 0.4,
  },

});
