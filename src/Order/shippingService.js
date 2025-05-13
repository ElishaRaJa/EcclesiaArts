import axios from 'axios';

const BOBGO_API_KEY = import.meta.env.VITE_BOBGO_API_KEY;
const BOBGO_BASE_URL = 'https://api.sandbox.bobgo.co.za/v2/';

const bobGoClient = axios.create({
  baseURL: BOBGO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${BOBGO_API_KEY}`
  }
});

export const getShippingRates = async (collectionAddress, deliveryAddress, parcels, contactInfo) => {
  try {
    const response = await bobGoClient.post('/rates', {
      collection_address: {
        street_address: collectionAddress.street,
        city: collectionAddress.city,
        zone: collectionAddress.state,
        country: "ZA",
        code: collectionAddress.postalCode
      },
      delivery_address: {
        street_address: deliveryAddress.street,
        city: deliveryAddress.city,
        zone: deliveryAddress.state,
        country: "ZA",
        code: deliveryAddress.postalCode
      },
      parcels: parcels.map(p => ({
        submitted_length_cm: p.length,
        submitted_width_cm: p.width,
        submitted_height_cm: p.height,
        submitted_weight_kg: p.weight
      })),
      declared_value: contactInfo.declaredValue,
      collection_contact_mobile_number: contactInfo.collectionPhone,
      delivery_contact_mobile_number: contactInfo.deliveryPhone
    });
    return response.data;
  } catch (error) {
    console.error('Bob Go API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch shipping rates');
  }
};
