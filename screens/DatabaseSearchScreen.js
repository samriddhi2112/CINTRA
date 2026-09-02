import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DatabaseSearchScreen({ navigation }) {

  const [criminalId, setCriminalId] = useState('');

  const handleSearch = () => {

    if (!criminalId.trim()) {
      Alert.alert(
        'Missing ID',
        'Please enter a Criminal ID.'
      );
      return;
    }

    // Backend search will be connected here later.
    Alert.alert(
      'Search',
      `Searching for ${criminalId}`
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
          CRIMINAL DATABASE
        </Text>

        <View style={{ width: 42 }} />

      </View>

      {/* Icon */}
      <View style={styles.mainIcon}>
        <Ionicons
          name="search"
          size={42}
          color="#1976D2"
        />
      </View>

      <Text style={styles.title}>
        Search Criminal Records
      </Text>

      <Text style={styles.description}>
        Enter the Criminal or Suspect ID to
        retrieve registered information.
      </Text>

      {/* Search Card */}
      <View style={styles.card}>

        <Text style={styles.label}>
          CRIMINAL / SUSPECT ID
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="card"
            size={20}
            color="#1976D2"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Criminal ID"
            placeholderTextColor="#999"
            value={criminalId}
            onChangeText={setCriminalId}
            autoCapitalize="characters"
          />

        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Ionicons
            name="search"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            SEARCH DATABASE
          </Text>
        </TouchableOpacity>

      </View>

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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1976D2',
    letterSpacing: 0.8,
  },

  mainIcon: {
    width: 85,
    height: 85,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },

  description: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 9,
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },

  searchButton: {
    height: 52,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 9,
  },

});

