import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchSuspect } from '../services/api';

export default function DatabaseSearchScreen({ navigation }) {

  const [criminalId, setCriminalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async (idToSearch = criminalId) => {
    const id = idToSearch.trim();

    if (!id) {
      Alert.alert(
        'Missing ID',
        'Please enter a Suspect/Criminal ID (e.g. S001).'
      );
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const data = await searchSuspect(id);
      setResult(data);

    } catch (error) {
      console.error('Suspect search error:', error);
      Alert.alert(
        'Search Failed',
        error.message || 'Suspect not found in database.'
      );
    } finally {
      setLoading(false);
    }
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

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

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
          Enter Suspect ID (e.g. S001) or Name (e.g. Raj) to retrieve live backend record.
        </Text>

        {/* Search Card */}
        <View style={styles.card}>

          <Text style={styles.label}>
            CRIMINAL / SUSPECT ID OR NAME
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="card"
              size={20}
              color="#1976D2"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter ID or Name (e.g. S001 or Raj)"
              placeholderTextColor="#999"
              value={criminalId}
              onChangeText={setCriminalId}
              autoCapitalize="none"
              editable={!loading}
            />

          </View>

          {/* Quick Demo ID Buttons */}
          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Demo IDs:</Text>
            {['S001', 'S002', 'S003'].map((code) => (
              <TouchableOpacity
                key={code}
                style={styles.demoChip}
                onPress={() => {
                  setCriminalId(code);
                  handleSearch(code);
                }}
              >
                <Text style={styles.demoChipText}>{code}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.disabledButton]}
            onPress={() => handleSearch()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons
                  name="search"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                  SEARCH DATABASE
                </Text>
              </>
            )}
          </TouchableOpacity>

        </View>

        {/* Suspect Result Card */}
        {result && (
          <View style={styles.resultCard}>

            <View style={styles.resultHeader}>
              <Ionicons name="person-circle" size={40} color="#1976D2" />
              <View style={styles.resultHeaderText}>
                <Text style={styles.suspectName}>{result.name}</Text>
                <Text style={styles.suspectCode}>ID: {result.suspect_id}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role / Charges</Text>
              <Text style={styles.detailValue}>{result.role}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, result.wanted ? styles.wantedText : styles.safeText]}>
                {result.wanted ? 'WANTED' : 'CLEARED'}
              </Text>
            </View>

          </View>
        )}

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 15,
    marginBottom: 20,
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
    marginBottom: 20,
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

  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },

  demoLabel: {
    fontSize: 12,
    color: '#888',
  },

  demoChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  demoChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
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

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 9,
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#1976D2',
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resultHeaderText: {
    marginLeft: 12,
  },

  suspectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  suspectCode: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 14,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  detailLabel: {
    fontSize: 13,
    color: '#666',
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  wantedText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },

  safeText: {
    color: '#388E3C',
    fontWeight: 'bold',
  },

});
