# Bob Go API Integration Documentation

## Firestore Schema Requirements

### User Collection:
- `shipping_address` (object):
  - `street_address` (string) - Required
  - `city` (string) - Required  
  - `zone` (string) - Required (state/province)
  - `country` (string) - Required (ISO code 'ZA')
  - `code` (string) - Required (postal code)
  - `phone` (string) - Required (contact number)

### Artwork Collection:
- `package_details` (object):
  - `length_cm` (number) - Required
  - `width_cm` (number) - Required
  - `height_cm` (number) - Required  
  - `weight_kg` (number) - Required
  - `declared_value` (number) - Required (ZAR)

## API Integration Notes

1. Always use HTTPS
2. Store API key in environment variables (VITE_BOBGO_API_KEY)
3. Sandbox endpoint: `https://api.sandbox.bobgo.co.za/v2/`
4. Production endpoint: `https://api.bobgo.co.za/v2/`

## Example Request Structure
```javascript
{
  collection_address: {
    street_address: "123 Gallery St",
    city: "Johannesburg",
    zone: "Gauteng",
    country: "ZA",
    code: "2000"
  },
  delivery_address: {
    street_address: "22 Customer Ave",
    city: "Cape Town", 
    zone: "Western Cape",
    country: "ZA",
    code: "8001"
  },
  parcels: [{
    submitted_length_cm: 30,
    submitted_width_cm: 30,
    submitted_height_cm: 5,
    submitted_weight_kg: 2
  }],
  declared_value: 1000,
  collection_contact_mobile_number: "+27123456789",
  delivery_contact_mobile_number: "+27876543210"
}
```

## Error Handling
- Check for 401 Unauthorized (invalid API key)
- Validate all required fields before API call
- Handle rate limiting (429 status code)
