import axios from 'axios';

const BOBGO_API_KEY = import.meta.env.VITE_BOBGO_API_KEY;
const BOBGO_BASE_URL = 'https://api.sandbox.bobgo.co.za/v2';

class BobGoService {
  static async getRatesAtCheckout(artwork, collectionAddress, deliveryAddress) {
    try {
      const response = await axios.post(
        `${BOBGO_BASE_URL}/rates-at-checkout`,
        {
          collection_address: collectionAddress,
          delivery_address: deliveryAddress,
          items: [{
            description: artwork.title,
            price: artwork.price,
            length_cm: artwork.packaging_length,
            width_cm: artwork.packaging_width,
            height_cm: artwork.packaging_height,
            weight_kg: artwork.total_weight
          }],
          declared_value: artwork.price,
          handling_time: 2
        },
        {
          headers: {
            'Authorization': `Bearer ${BOBGO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting rates at checkout:', error);
      throw new Error('Failed to get shipping rates');
    }
  }

  static async createOrder(orderData) {
    try {
      const response = await axios.post(
        `${BOBGO_BASE_URL}/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${BOBGO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  static async validateAddress(address) {
    try {
      const response = await axios.post(
        `${BOBGO_BASE_URL}/address/validate`,
        {
          company: address.company || '',
          street_address: address.street,
          local_area: address.local_area || address.city,
          city: address.city,
          zone: address.zone,
          country: address.country,
          code: address.code
        },
        {
          headers: {
            'Authorization': `Bearer ${BOBGO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return {
        isValid: response.data.valid,
        normalized: response.data.normalized_address
      };
    } catch (error) {
      console.error('Error validating address:', error);
      throw new Error('Failed to validate address');
    }
  }
}

export default BobGoService;
