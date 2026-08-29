import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ScannerScreen({ navigation }) {
  const handleScan = () => {
    navigation.navigate('Result');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CINTRA</Text>

      <View style={styles.cameraBox}>
        <Text style={styles.cameraText}>
          Camera Area
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleScan}
      >
        <Text style={styles.buttonText}>SCAN</Text>
      </TouchableOpacity>
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

  cameraBox: {
    width: '100%',
    height: 400,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  cameraText: {
    fontSize: 18,
    color: '#777',
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});