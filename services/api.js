import { Platform } from 'react-native';
import Constants from 'expo-constants';

// FastAPI backend port
const PORT = 8000;

// Backend IP address.
//
// If EXPO_PUBLIC_BACKEND_IP is defined in a .env file,
// Expo will use that value.
//
// Otherwise, this falls back to the IP currently used
// on your computer so your existing setup keeps working.
const BACKEND_IP =
  process.env.EXPO_PUBLIC_BACKEND_IP || '10.61.0.174';

const getBaseUrl = () => {
  return `http://${BACKEND_IP}:${PORT}`;
};

export const BASE_URL = getBaseUrl();

console.log('[CINTRA API] Backend URL:', BASE_URL);

const DEFAULT_HEADERS = {
  Accept: 'application/json',
};

let localScanCount = 0;

export function getGlobalScanCount() {
  return localScanCount;
}

export function incrementGlobalScanCount() {
  localScanCount += 1;
  return localScanCount;
}

export function resetGlobalScanCount() {
  localScanCount = 0;
  return localScanCount;
}

/**
 * Sends a captured image to the CINTRA backend
 * for face/suspect identification.
 */
export async function identifyFace(imageUri) {
  if (!imageUri) {
    throw new Error('No image was provided.');
  }

  const targetUrl = `${BASE_URL}/api/v1/identify`;

  console.log('[CINTRA API] Sending image to:', targetUrl);

  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: 'scan.jpg',
    type: 'image/jpeg',
  });

  try {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      console.log('[CINTRA API] Backend response:', data);

      return data;
    }

    console.error(
      '[CINTRA API] Backend returned HTTP status:',
      response.status
    );

    return {
      match: false,
      suspect: null,
      message: 'Backend request failed',
    };
  } catch (netErr) {
    console.error(
      '[CINTRA API] Network fetch error:',
      netErr.message
    );

    return {
      match: false,
      suspect: null,
      message: 'Unable to connect to CINTRA backend',
    };
  }
}

/**
 * Fetch a suspect record from the CINTRA backend.
 */
export async function getSuspect(suspectId) {
  const targetUrl = `${BASE_URL}/api/v1/suspects/${suspectId}`;

  console.log('[CINTRA API] Fetching suspect:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      console.error(
        '[CINTRA API] Suspect request failed:',
        response.status
      );

      return null;
    }

    return await response.json();
  } catch (netErr) {
    console.error(
      '[CINTRA API] Suspect search error:',
      netErr
    );

    return null;
  }
}

/**
 * Upload evidence to the CINTRA backend.
 */
export async function uploadEvidence(formData) {
  const targetUrl = `${BASE_URL}/api/v1/evidence`;

  console.log('[CINTRA API] Uploading evidence:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      console.error(
        '[CINTRA API] Evidence upload failed:',
        response.status
      );

      return null;
    }

    return await response.json();
  } catch (netErr) {
    console.error(
      '[CINTRA API] Evidence upload error:',
      netErr
    );

    return null;
  }
}