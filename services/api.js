import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 8000;

const getBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.developer?.manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:${PORT}`;
    }
  }

  return `http://10.63.3.75:${PORT}`;
};

export const BASE_URL = getBaseUrl();

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
};

/**
 * Sends a captured image to the CINTRA backend
 * for face/suspect identification.
 */
export async function identifyFace(imageUri) {
  if (!imageUri) {
    throw new Error('No image was provided.');
  }

  const targetUrl = `${BASE_URL}/api/v1/identify`;
  const formattedUri = Platform.OS === 'android' ? imageUri : imageUri.replace('file://', '');

  const formData = new FormData();

  formData.append('image', {
    uri: formattedUri,
    name: 'scan.jpg',
    type: 'image/jpeg',
  });

  let response;
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: DEFAULT_HEADERS,
    });
  } catch (netErr) {
    console.error('[CINTRA API] Fetch error:', netErr);
    throw new Error(`Cannot connect to backend server at ${targetUrl}. Please check network.`);
  }

  if (!response.ok) {
    let errorMessage = `Backend request failed with status ${response.status}.`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (error) {}
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Fetches suspect details by suspect_code / criminal_id
 * GET /api/v1/suspects/{suspectCode}
 */
export async function searchSuspect(suspectCode) {
  if (!suspectCode) {
    throw new Error('Suspect ID is required.');
  }

  const targetUrl = `${BASE_URL}/api/v1/suspects/${encodeURIComponent(suspectCode.trim())}`;
  console.log('[CINTRA API] Fetching suspect:', targetUrl);

  let response;
  try {
    response = await fetch(targetUrl, {
      headers: DEFAULT_HEADERS,
    });
  } catch (netErr) {
    console.error('[CINTRA API] Suspect search error:', netErr);
    throw new Error(`Cannot connect to server at ${targetUrl}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Suspect ID '${suspectCode}' was not found in the database.`);
    }
    throw new Error(`Search failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Uploads evidence (image, video, audio, document) to backend
 * POST /api/v1/evidence/upload
 */
export async function uploadEvidence(fileUri, fileName, mimeType, evidenceType = 'Evidence', badgeId = null) {
  if (!fileUri) {
    throw new Error('No file selected for upload.');
  }

  const targetUrl = `${BASE_URL}/api/v1/evidence/upload`;
  const formattedUri = Platform.OS === 'android' ? fileUri : fileUri.replace('file://', '');

  const formData = new FormData();

  formData.append('file', {
    uri: formattedUri,
    name: fileName || 'evidence_file',
    type: mimeType || 'application/octet-stream',
  });

  formData.append('type', evidenceType);
  if (badgeId) {
    formData.append('badge_id', badgeId);
  }

  let response;
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: DEFAULT_HEADERS,
    });
  } catch (netErr) {
    console.error('[CINTRA API] Evidence upload error:', netErr);
    throw new Error(`Cannot connect to evidence server at ${targetUrl}`);
  }

  if (!response.ok) {
    let errorMessage = `Upload failed with status ${response.status}.`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (error) {}
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Optional health-check function.
 */
export async function checkBackendHealth() {
  const response = await fetch(`${BASE_URL}/api/v1/health`, {
    headers: DEFAULT_HEADERS,
  });
  if (!response.ok) {
    throw new Error(`Backend health check failed with status ${response.status}.`);
  }
  return await response.json();
}
