// Profile completion checker utility
export const isProfileComplete = (userData) => {
    if (!userData) return { complete: false, missing: ['all'] };
    
    const requiredFields = [
        'username',
        'first_name', 
        'last_name',
        'phone_number',
        'shipping_address'
    ];
    
    const missingFields = [];
    
    // Check basic fields
    requiredFields.forEach(field => {
        if (!userData[field]) {
            missingFields.push(field);
        }
    });
    
    // Check shipping address fields
    if (userData.shipping_address) {
        const addressFields = ['street', 'city', 'state', 'zip', 'country'];
        addressFields.forEach(field => {
            if (!userData.shipping_address[field]) {
                missingFields.push(`shipping_${field}`);
            }
        });
    }
    
    // Check billing address if different
    if (!userData.same_billing_shipping && userData.billing_address) {
        const addressFields = ['street', 'city', 'state', 'zip', 'country'];
        addressFields.forEach(field => {
            if (!userData.billing_address[field]) {
                missingFields.push(`billing_${field}`);
            }
        });
    }
    
    return {
        complete: missingFields.length === 0,
        missing: missingFields
    };
};

export const getProfileCompletionMessage = (missingFields) => {
    if (missingFields.includes('all')) {
        return 'Please complete your profile to make purchases';
    }
    
    const messages = {
        'first_name': 'First name is required',
        'last_name': 'Last name is required',
        'phone_number': 'Phone number is required',
        'shipping_street': 'Shipping street address is required',
        'shipping_city': 'Shipping city is required',
        'shipping_state': 'Shipping state is required',
        'shipping_zip': 'Shipping zip code is required',
        'shipping_country': 'Shipping country is required',
        'billing_street': 'Billing street address is required',
        'billing_city': 'Billing city is required',
        'billing_state': 'Billing state is required',
        'billing_zip': 'Billing zip code is required',
        'billing_country': 'Billing country is required'
    };
    
    const specificMessages = missingFields
        .filter(field => messages[field])
        .map(field => messages[field]);
    
    return specificMessages.length > 0 
        ? `Please complete: ${specificMessages.join(', ')}`
        : 'Please complete your profile details';
};
