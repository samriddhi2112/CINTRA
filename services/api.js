import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 8001;

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

/**
 * Sends a captured image to the CINTRA backend
 * for face/suspect identification.
 *
 * Backend contract:
 * POST /api/v1/identify
 * multipart/form-data
 * field name: image
 */
export async function identifyFace(imageUri) {
  if (!imageUri) {
    throw new Error('No image was provided.');
  }

  const targetUrl = `${BASE_URL}/api/v1/identify`;
  console.log('[CINTRA API] Target URL:', targetUrl);
  console.log('[CINTRA API] Image URI:', imageUri);

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
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (netErr) {
    console.error('[CINTRA API] Fetch error:', netErr);
    throw new Error(`Cannot connect to backend server at ${targetUrl}. Please check Windows Firewall.`);
  }

  if (!response.ok) {
    let errorMessage = `Backend request failed with status ${response.status}.`;

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (error) {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  return data;
}

/**
 * Optional health-check function.
 * Useful for testing whether the backend is reachable.
 */
export async function checkBackendHealth() {
  const response = await fetch(`${BASE_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error(
      `Backend health check failed with status ${response.status}.`
    );
  }

  return await response.json();
}
