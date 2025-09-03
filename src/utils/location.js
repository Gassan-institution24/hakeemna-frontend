import axios from 'axios';

export const getAddressFromCoordinatesOSM = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lng}&lon=${lat}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'hakeemna.com' },
    });
    return response.data.display_name || 'Unknown location';
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Unknown location';
  }
};
