/**
 * Utility for formatting addresses to match Bob Go API requirements
 */

export const formatAddressForBobGo = (address) => {
  // Standardize country code
  const countryCode = address.country === 'South Africa' ? 'ZA' : 
                     address.country?.length === 2 ? address.country.toUpperCase() :
                     address.country?.toUpperCase() || 'ZA';

  // Format phone number (add country code if missing)
  const formatPhone = (phone, country = 'ZA') => {
    if (!phone) return '';
    
    // If already has +, return as-is
    if (phone.startsWith('+')) return phone;
    
    // Handle South Africa numbers
    if (country === 'ZA') {
      return phone.startsWith('0') ? `+27${phone.slice(1)}` : `+27${phone}`;
    }
    
    // Default - just add + if missing
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  return {
    company: address.company || '',
    street_address: address.street || address.shipping_street || address.billing_street || '',
    local_area: address.local_area || address.city || '',
    city: address.city || address.shipping_city || address.billing_city || '',
    zone: standardizeProvince(address.state || address.shipping_state || address.billing_state || ''),
    country: countryCode,
    code: address.postal_code || address.shipping_zip || address.billing_zip || '',
    contact_mobile_number: formatPhone(address.phone || address.phone_number || '', countryCode)
  };
};

const standardizeProvince = (province) => {
  const mappings = {
    'kwa-zulu-natal': 'KZN',
    'kwa zulu natal': 'KZN',
    'western cape': 'WC',
    'eastern cape': 'EC',
    'gauteng': 'GP',
    'free state': 'FS',
    'limpopo': 'LP',
    'mpumalanga': 'MP',
    'north west': 'NW',
    'northern cape': 'NC'
  };
  
  const lowerProvince = province.toLowerCase().trim();
  return mappings[lowerProvince] || province;
};

export const formatContactInfo = (userData) => {
  const countryCode = userData.country === 'South Africa' ? 'ZA' : 
                     userData.country?.length === 2 ? userData.country.toUpperCase() :
                     userData.country?.toUpperCase() || 'ZA';

  return {
    full_name: `${userData.first_name} ${userData.last_name}`.trim(),
    email: userData.email || '',
    mobile_number: formatPhone(userData.phone || userData.phone_number || '', countryCode)
  };
};
