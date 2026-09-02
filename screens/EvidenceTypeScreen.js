import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function EvidenceTypeScreen({ navigation, route }) {

  const type = route?.params?.type || 'Evidence';

  const getIcon = () => {
    switch (type) {
      case 'Image':
        return 'image';

      case 'Video':
        return 'videocam';

      case 'Audio':
        return 'mic';

      case 'Document':
        return 'document-text';

      default:
        return 'folder';
    }
  };

  const handleSelect = () => {
    // Actual file picker will be added later.
    Alert.alert(
      'Select Evidence',
      `Select a ${type.toLowerCase()} file.`
    );
  };

  const handleUpload = () => {
    // Backend upload will be connected later.
    Alert.alert(
      'Upload',
      `${type} upload will be connected to the backend.`
    );
  };

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
          {type.toUpperCase()}
        </Text>

        <View style={{ width: 42 }} />

      </View>

      {/* Main Icon */}
      <View style={styles.mainIcon}>
        <Ionicons
          name={getIcon()}
          size={45}
          color="#1976D2"
        />
      </View>

      <Text style={styles.title}>
        Upload {type}
      </Text>

      <Text style={styles.description}>
        Select a {type.toLowerCase()} file from your
        device and upload it as investigation evidence.
      </Text>

      {/* File Selection Card */}
      <View style={styles.card}>

        <View style={styles.fileIcon}>
          <Ionicons
            name={getIcon()}
            size={30}
            color="#1976D2"
          />
        </View>

        <Text style={styles.fileText}>
          No file selected
        </Text>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={handleSelect}
        >
          <Ionicons
            name="folder-open"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            SELECT {type.toUpperCase()}
          </Text>
        </TouchableOpacity>

      </View>

      {/* Upload Button */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
      >
        <Ionicons
          name="cloud-upload"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          UPLOAD EVIDENCE
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
    marginBottom: 35,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    letterSpacing: 0.8,
  },

  mainIcon: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },

  description: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 25,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    elevation: 3,
  },

  fileIcon: {
    width: 65,
    height: 65,
    borderRadius: 15,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  fileText: {
    color: '#888',
    fontSize: 13,
    marginBottom: 18,
  },

  selectButton: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});
