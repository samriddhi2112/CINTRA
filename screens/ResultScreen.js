import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RESULT</Text>

      <View style={styles.photoBox}>
        <Text style={styles.photoText}>
          Captured Photo
        </Text>
      </View>

      <Text style={styles.result}>
        No Match Found
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 30,
  },

  photoBox: {
    width: '100%',
    height: 350,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  photoText: {
    color: '#777',
    fontSize: 18,
  },

  result: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});