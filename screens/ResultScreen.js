import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function ResultScreen({ route, navigation }) {
  /*
    Temporary mock response.

    Later this data will come from Person 2's backend.

    DO NOT treat this as real suspect data.
  */

  const mockResponse = {
    match: true,
    suspect: {
      suspect_id: 'S001',
      name: 'Demo Suspect',
      role: 'Demo Role',
      confidence: 94.6,
      wanted: true,
    },
    message: 'Match Found',
  };

  /*
    If ScannerScreen passes a real response,
    use that response.

    Otherwise use the temporary mock response.
  */

  const response = route?.params?.response || mockResponse;
  const capturedImage = route?.params?.capturedImage || null;

  const isMatch = response.match === true;

  const handleScanAgain = () => {
    navigation.navigate('Scanner');
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          CINTRA
        </Text>

        <Text style={styles.headerSubtitle}>
          Identification Result
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Captured image */}
        <View style={styles.imageContainer}>

          {capturedImage ? (
            <Image
              source={{ uri: capturedImage }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>
                No Image
              </Text>
            </View>
          )}

          {/* Detection box */}
          <View
            style={[
              styles.detectionBox,
              isMatch
                ? styles.matchBox
                : styles.noMatchBox,
            ]}
          >
            <View
              style={[
                styles.boxBadge,
                isMatch ? styles.matchBadge : styles.noMatchBadge,
              ]}
            >
              <Text style={styles.boxBadgeText}>
                {isMatch ? '✓ MATCH FOUND' : '⚠ NO MATCH'}
              </Text>
            </View>
          </View>

        </View>

        {/* Result status */}
        <View
          style={[
            styles.resultCard,
            isMatch
              ? styles.matchCard
              : styles.noMatchCard,
          ]}
        >

          <Text
            style={[
              styles.resultTitle,
              isMatch
                ? styles.matchText
                : styles.noMatchText,
            ]}
          >
            {isMatch ? 'MATCH FOUND' : 'NO MATCH FOUND'}
          </Text>

          <Text style={styles.resultMessage}>
            {response.message}
          </Text>

        </View>

        {/* Suspect information */}
        {isMatch && response.suspect && (
          <View style={styles.suspectCard}>

            <Text style={styles.sectionTitle}>
              SUSPECT INFORMATION
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Name
              </Text>

              <Text style={styles.value}>
                {response.suspect.name}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Role
              </Text>

              <Text style={styles.value}>
                {response.suspect.role}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Confidence
              </Text>

              <Text style={styles.value}>
                {response.suspect.confidence}%
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Status
              </Text>

              <Text
                style={[
                  styles.value,
                  response.suspect.wanted
                    ? styles.wantedText
                    : styles.notWantedText,
                ]}
              >
                {response.suspect.wanted
                  ? 'WANTED'
                  : 'NOT WANTED'}
              </Text>
            </View>

          </View>
        )}

        {/* Scan again */}
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={handleScanAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.scanAgainText}>
            SCAN AGAIN
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#000',
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#ccc',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#222',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  noImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noImageText: {
    color: '#fff',
    fontSize: 18,
  },

  detectionBox: {
    position: 'absolute',
    width: 220,
    height: 280,
    top: 60,
    left: '50%',
    marginLeft: -110,
    borderWidth: 4,
    borderRadius: 12,
    alignItems: 'center',
  },

  matchBox: {
    borderColor: '#00c853',
    backgroundColor: 'rgba(0, 200, 83, 0.18)',
  },

  noMatchBox: {
    borderColor: '#ffd600',
    backgroundColor: 'rgba(255, 214, 0, 0.12)',
  },

  boxBadge: {
    position: 'absolute',
    top: -16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 3,
  },

  matchBadge: {
    backgroundColor: '#00c853',
  },

  noMatchBadge: {
    backgroundColor: '#ffd600',
  },

  boxBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  resultCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },

  matchCard: {
    backgroundColor: '#e8f5e9',
    borderColor: '#00c853',
  },

  noMatchCard: {
    backgroundColor: '#fffde7',
    borderColor: '#ffd600',
  },

  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  matchText: {
    color: '#00a040',
  },

  noMatchText: {
    color: '#9e8500',
  },

  resultMessage: {
    marginTop: 8,
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },

  suspectCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  label: {
    fontSize: 15,
    color: '#666',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    maxWidth: '60%',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
  },

  wantedText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },

  notWantedText: {
    color: '#388e3c',
    fontWeight: 'bold',
  },

  scanAgainButton: {
    marginTop: 25,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanAgainText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

});