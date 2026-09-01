const BASE_URL = 'http://10.63.13.158:8000';

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

  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: 'scan.jpg',
    type: 'image/jpeg',
  });

  const response = await fetch(`${BASE_URL}/api/v1/identify`, {
    method: 'POST',
    body: formData,
  });

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