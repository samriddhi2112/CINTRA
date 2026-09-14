import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BiometricScanHUD({
  isScanning = false,
  onScanComplete = null,
  scanCount = 0,
  mockResult = null,
  style,
}) {
  // Scan State Cycle:
  // INITIALIZING SCANNER
  // -> FACE DETECTED
  // -> ANALYZING BIOMETRIC DATA
  // -> VERIFYING MATCH
  // -> MATCH FOUND / NO MATCH FOUND

  const [scanState, setScanState] = useState('INITIALIZING SCANNER');
  const [progress, setProgress] = useState(0);
  const [resultData, setResultData] = useState(null);

  // Tracks whether the 4.5 second visual processing window has finished.
  const processingFinishedRef = useRef(false);

  // Prevents the final result from being shown more than once.
  const resultShownRef = useRef(false);

  // Animations
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const matchPulseAnim = useRef(new Animated.Value(0)).current;
  const glowIntensityAnim = useRef(new Animated.Value(0.4)).current;
  const statusFadeAnim = useRef(new Animated.Value(1)).current;

  // ---------------------------------------------------------
  // Scanning laser beam animation loop
  // ---------------------------------------------------------
  useEffect(() => {
    const laserLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 310,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),

        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    laserLoop.start();
    pulseLoop.start();

    return () => {
      laserLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  // ---------------------------------------------------------
  // Smooth state transition helper
  // ---------------------------------------------------------
  const transitionState = (newState) => {
    Animated.sequence([
      Animated.timing(statusFadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),

      Animated.timing(statusFadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setScanState(newState);
  };

  // ---------------------------------------------------------
  // Show the REAL backend result
  // ---------------------------------------------------------
  const showBackendResult = (res) => {
    if (resultShownRef.current) {
      return;
    }

    if (
      !res ||
      typeof res.match !== 'boolean'
    ) {
      return;
    }

    resultShownRef.current = true;

    console.log(
      '[CINTRA HUD] Showing backend result:',
      res
    );

    setProgress(100);
    setResultData(res);

    // -------------------------------------------------------
    // MATCH
    // -------------------------------------------------------
    if (res.match === true) {
      transitionState('MATCH FOUND');

      Animated.parallel([
        Animated.timing(glowIntensityAnim, {
          toValue: 1.0,
          duration: 400,
          useNativeDriver: false,
        }),

        Animated.sequence([
          Animated.timing(matchPulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),

          Animated.timing(matchPulseAnim, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }

    // -------------------------------------------------------
    // NO MATCH
    // -------------------------------------------------------
    else {
      transitionState('NO MATCH FOUND');

      Animated.timing(glowIntensityAnim, {
        toValue: 0.2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    // Tell ScannerScreen that the scan has completed.
    if (onScanComplete) {
      onScanComplete(res);
    }
  };

  // ---------------------------------------------------------
  // Trigger scan sequence when isScanning changes
  // ---------------------------------------------------------
  useEffect(() => {
    if (!isScanning) {
      return;
    }

    let isMounted = true;

    // Reset state for a new scan
    processingFinishedRef.current = false;
    resultShownRef.current = false;

    setProgress(0);
    setResultData(null);

    matchPulseAnim.setValue(0);
    glowIntensityAnim.setValue(0.4);

    // -------------------------------------------------------
    // Step 1: INITIALIZING SCANNER
    // -------------------------------------------------------
    transitionState('INITIALIZING SCANNER');

    const t1 = setTimeout(() => {
      if (!isMounted) return;

      transitionState('FACE DETECTED');
      setProgress(20);
    }, 500);

    // -------------------------------------------------------
    // Step 2: ANALYZING BIOMETRIC DATA
    // -------------------------------------------------------
    const t2 = setTimeout(() => {
      if (!isMounted) return;

      transitionState('ANALYZING BIOMETRIC DATA');
      setProgress(68);
    }, 1200);

    // -------------------------------------------------------
    // Step 3: VERIFYING MATCH
    // -------------------------------------------------------
    const t3 = setTimeout(() => {
      if (!isMounted) return;

      transitionState('VERIFYING MATCH');
      setProgress(90);
    }, 3000);

    // -------------------------------------------------------
    // Step 4: 4.5 SECOND PROCESSING WINDOW
    // -------------------------------------------------------
    //
    // IMPORTANT:
    //
    // We DO NOT create a fake NO MATCH result anymore.
    //
    // At 4.5 seconds:
    //
    //   Backend already responded
    //       -> show backend result
    //
    //   Backend has NOT responded
    //       -> remain on VERIFYING MATCH
    //
    // When the backend eventually responds:
    //       -> show the real backend result
    //
    const t5 = setTimeout(() => {
      if (!isMounted) return;

      processingFinishedRef.current = true;

      setProgress(100);

      console.log(
        '[CINTRA HUD] 4.5 second processing window finished.'
      );

      // If backend result is already available,
      // show it now.
      if (
        mockResult &&
        typeof mockResult.match === 'boolean'
      ) {
        showBackendResult(mockResult);
      } else {
        // Backend is still processing.
        // DO NOT show NO MATCH.
        console.log(
          '[CINTRA HUD] Backend result not ready. Waiting...'
        );

        transitionState('VERIFYING MATCH');
      }
    }, 4500);

    // -------------------------------------------------------
    // Cleanup timers
    // -------------------------------------------------------
    return () => {
      isMounted = false;

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t5);
    };
  }, [isScanning]);

  // ---------------------------------------------------------
  // Handle backend result arriving
  // ---------------------------------------------------------
  //
  // This effect is separate from the 4.5 second timer.
  //
  // This is what fixes the original problem:
  //
  // If the backend takes longer than 4.5 seconds, the HUD
  // waits instead of incorrectly displaying NO MATCH FOUND.
  //
  useEffect(() => {
    if (!isScanning) {
      return;
    }

    if (
      !processingFinishedRef.current ||
      resultShownRef.current
    ) {
      return;
    }

    if (
      !mockResult ||
      typeof mockResult.match !== 'boolean'
    ) {
      return;
    }

    console.log(
      '[CINTRA HUD] Backend result arrived after processing window.'
    );

    showBackendResult(mockResult);
  }, [mockResult, isScanning]);

  // ---------------------------------------------------------
  // Reset HUD when scanning stops
  // ---------------------------------------------------------
  useEffect(() => {
    if (isScanning) {
      return;
    }

    processingFinishedRef.current = false;
    resultShownRef.current = false;
  }, [isScanning]);

  // ---------------------------------------------------------
  // Determine current visual state
  // ---------------------------------------------------------
  const isMatchFound =
    scanState === 'MATCH FOUND';

  const isNoMatch =
    scanState === 'NO MATCH' ||
    scanState === 'NO MATCH FOUND';

  const themeColor = isMatchFound
    ? '#00FF66'
    : isNoMatch
    ? '#FF3B30'
    : '#00E5FF';

  // ---------------------------------------------------------
  // Get REAL confidence from backend result
  // ---------------------------------------------------------
  const backendConfidence =
    resultData?.suspect?.confidence;

  // Format confidence nicely
  const formattedConfidence =
    typeof backendConfidence === 'number'
      ? backendConfidence.toFixed(1)
      : backendConfidence != null
      ? String(backendConfidence)
      : null;

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  return (
    <View style={[styles.container, style]}>

      {/* Background Cyber Grid Overlay */}
      <View style={styles.gridOverlay} />

      {/* ---------------------------------------------------
          Top HUD Header
      --------------------------------------------------- */}
      <View style={styles.topHudContainer}>

        <View style={styles.topHudRow}>
          <View style={styles.hudBadge}>
            <View
              style={[
                styles.indicatorDot,
                {
                  backgroundColor: themeColor,
                },
              ]}
            />

            <Text style={styles.hudBadgeText}>
              SYS: ONLINE
            </Text>
          </View>

          <Text style={styles.monoMetadata}>
            ENC: AES-256-GCM | FPS: 60.0
          </Text>
        </View>

        <View style={styles.topHudRow}>
          <Text style={styles.monoMetadata}>
            LAT: 28.5355° N | LON: 77.3910° E
          </Text>

          <Text style={styles.monoMetadata}>
            BIO-VER: 4.9.2
          </Text>
        </View>

      </View>

      {/* ---------------------------------------------------
          Central Scanning Box
      --------------------------------------------------- */}
      <View style={styles.scanBoxWrapper}>

        {/* Confirmation Pulse Ring on Match */}
        {isMatchFound && (
          <Animated.View
            style={[
              styles.matchPulseRing,
              {
                borderColor: '#00FF66',
                transform: [
                  {
                    scale: pulseAnim,
                  },
                ],
                opacity: matchPulseAnim,
              },
            ]}
          />
        )}

        {/* Corner Brackets */}
        <View
          style={[
            styles.corner,
            styles.cornerTL,
            {
              borderColor: themeColor,
            },
          ]}
        />

        <View
          style={[
            styles.corner,
            styles.cornerTR,
            {
              borderColor: themeColor,
            },
          ]}
        />

        <View
          style={[
            styles.corner,
            styles.cornerBL,
            {
              borderColor: themeColor,
            },
          ]}
        />

        <View
          style={[
            styles.corner,
            styles.cornerBR,
            {
              borderColor: themeColor,
            },
          ]}
        />

        {/* Center Target Frame Box */}
        <View
          style={[
            styles.faceTargetFrame,
            {
              borderColor: `${themeColor}40`,
            },
          ]}
        >

          {/* Vertical Scanning Beam */}
          {isScanning &&
            !isMatchFound &&
            !isNoMatch && (
              <Animated.View
                style={[
                  styles.scanLaserBeam,
                  {
                    top: scanLineAnim,
                    backgroundColor: themeColor,
                    shadowColor: themeColor,
                  },
                ]}
              />
            )}

        </View>

        {/* Scan Percentage Count Badge */}
        <View style={styles.percentageBadge}>
          <Text
            style={[
              styles.percentageText,
              {
                color: themeColor,
              },
            ]}
          >
            {progress}%
          </Text>
        </View>

      </View>

      {/* ---------------------------------------------------
          Dynamic Status Text
      --------------------------------------------------- */}
      <Animated.View
        style={[
          styles.statusContainer,
          {
            opacity: statusFadeAnim,
          },
        ]}
      >

        <View style={styles.statusBox}>

          <Ionicons
            name={
              isMatchFound
                ? 'checkmark-circle'
                : isNoMatch
                ? 'close-circle'
                : 'scan'
            }
            size={22}
            color={themeColor}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: themeColor,
              },
            ]}
          >
            {isMatchFound
              ? '✓ MATCH FOUND'
              : isNoMatch
              ? 'NO MATCH FOUND'
              : scanState}
          </Text>

        </View>

        {/* -------------------------------------------------
            Match Banner
        ------------------------------------------------- */}
        {isMatchFound && (
          <View style={styles.matchBanner}>

            <Text style={styles.matchBannerTitle}>
              IDENTITY VERIFIED
            </Text>

            {/* REAL BACKEND CONFIDENCE */}
            <Text style={styles.matchBannerSub}>
              {formattedConfidence !== null
                ? `CONFIDENCE ${formattedConfidence}%`
                : 'CONFIDENCE UNAVAILABLE'}
            </Text>

            {/* REAL BACKEND SUSPECT DATA */}
            {resultData?.suspect && (
              <>
                <Text style={styles.matchBannerSub}>
                  SUSPECT ID:{' '}
                  {resultData.suspect.suspect_id}
                  {' | '}
                  {resultData.suspect.name?.toUpperCase()}
                </Text>

                {resultData.suspect.role && (
                  <Text style={styles.matchBannerSub}>
                    {resultData.suspect.role}
                  </Text>
                )}
              </>
            )}

          </View>
        )}

        {/* -------------------------------------------------
            No Match Banner
        ------------------------------------------------- */}
        {isNoMatch && (
          <View style={styles.noMatchBanner}>

            <Text style={styles.noMatchTitle}>
              NO MATCH FOUND
            </Text>

            <Text style={styles.noMatchSub}>
              FACIAL BIOMETRIC UNRECOGNIZED
            </Text>

          </View>
        )}

      </Animated.View>

      {/* ---------------------------------------------------
          Bottom Technical Metadata Stream
      --------------------------------------------------- */}
      <View style={styles.bottomHudContainer}>

        <Text style={styles.monoMetadata}>
          HASH:{' '}
          {resultData?.suspect?.suspect_id
            ? `${resultData.suspect.suspect_id}-SHA256-${(
                resultData.suspect.name || ''
              ).substring(0, 3)}`
            : '7F9A08B2-E841-4C9D-9A73'}
        </Text>

      </View>

    </View>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 45,
    zIndex: 15,
  },

  // -------------------------------------------------------
  // Grid
  // -------------------------------------------------------

  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },

  // -------------------------------------------------------
  // Top HUD
  // -------------------------------------------------------

  topHudContainer: {
    width: '90%',
    backgroundColor: 'rgba(5, 15, 25, 0.75)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },

  topHudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },

  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },

  hudBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00E5FF',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Courier'
        : 'monospace',
    letterSpacing: 0.8,
  },

  monoMetadata: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Courier'
        : 'monospace',
    letterSpacing: 0.5,
  },

  // -------------------------------------------------------
  // Scan Box
  // -------------------------------------------------------

  scanBoxWrapper: {
    width: 260,
    height: 320,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchPulseRing: {
    position: 'absolute',
    width: 280,
    height: 340,
    borderRadius: 18,
    borderWidth: 2,
    zIndex: 2,
  },

  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    zIndex: 10,
  },

  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },

  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },

  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },

  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },

  faceTargetFrame: {
    width: 260,
    height: 320,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  scanLaserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    shadowRadius: 10,
    shadowOpacity: 1,
    zIndex: 8,
  },

  // -------------------------------------------------------
  // Percentage
  // -------------------------------------------------------

  percentageBadge: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },

  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Courier'
        : 'monospace',
  },

  // -------------------------------------------------------
  // Status
  // -------------------------------------------------------

  statusContainer: {
    alignItems: 'center',
    width: '90%',
  },

  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 15, 25, 0.85)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    elevation: 5,
  },

  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1.2,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Courier'
        : 'monospace',
  },

  // -------------------------------------------------------
  // Match Banner
  // -------------------------------------------------------

  matchBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FF66',
  },

  matchBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00FF66',
    letterSpacing: 1,
  },

  matchBannerSub: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 3,
    fontWeight: '600',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Courier'
        : 'monospace',
  },

  // -------------------------------------------------------
  // No Match Banner
  // -------------------------------------------------------

  noMatchBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },

  noMatchTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF3B30',
    letterSpacing: 0.8,
  },

  noMatchSub: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 3,
    fontFamily:
      Platform.OS === 'ios'
        ? 'Courier'
        : 'monospace',
  },

  // -------------------------------------------------------
  // Bottom HUD
  // -------------------------------------------------------

  bottomHudContainer: {
    width: '90%',
    backgroundColor: 'rgba(5, 15, 25, 0.75)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    gap: 2,
  },

});