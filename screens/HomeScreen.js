import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CINTRA</Text>
          <Text style={styles.subtitle}>
            Investigation & Intelligence
          </Text>
        </View>

        <View style={styles.profileIcon}>
          <Ionicons
            name="person"
            size={24}
            color="#1976D2"
          />
        </View>
      </View>

      <Text style={styles.welcome}>
        Welcome, Officer
      </Text>

      <Text style={styles.description}>
        Select an operation to continue
      </Text>


      {/* CAPTURE & MATCH */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Scanner')}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="camera"
            size={34}
            color="#1976D2"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            CAPTURE & MATCH
          </Text>

          <Text style={styles.cardText}>
            Capture evidence and identify a suspect
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#1976D2"
        />
      </TouchableOpacity>


      {/* CRIMINAL DATABASE */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DatabaseSearch')}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="search"
            size={34}
            color="#1976D2"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            CRIMINAL DATABASE
          </Text>

          <Text style={styles.cardText}>
            Search criminal records using ID
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#1976D2"
        />
      </TouchableOpacity>


      {/* UPLOAD EVIDENCE */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EvidenceUpload')}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="cloud-upload"
            size={34}
            color="#1976D2"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            UPLOAD EVIDENCE
          </Text>

          <Text style={styles.cardText}>
            Upload image, video, audio or documents
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#1976D2"
        />
      </TouchableOpacity>


      {/* SECURITY STATUS */}
      <View style={styles.securityBox}>
        <Ionicons
          name="shield-checkmark"
          size={22}
          color="#1976D2"
        />

        <View style={styles.securityTextContainer}>
          <Text style={styles.securityTitle}>
            SECURE SESSION
          </Text>

          <Text style={styles.securityText}>
            Authentication active
          </Text>
        </View>
      </View>


      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logout}
        onPress={() => navigation.replace('Login')}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#1976D2',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 12,

    backgroundColor: '#E3F2FD',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 15,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.5,
  },

  cardText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    lineHeight: 17,
  },

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#E3F2FD',

    borderRadius: 10,
    padding: 14,

    marginTop: 10,
  },

  securityTextContainer: {
    marginLeft: 10,
  },

  securityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
    letterSpacing: 0.5,
  },

  securityText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },

  logout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 22,
    padding: 10,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 7,
  },

});
