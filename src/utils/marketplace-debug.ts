// Debug utility for marketplace API responses
export const debugMarketplaceResponse = (response: any) => {
  console.group('🔍 Marketplace API Debug');
  console.log('Full response:', response);
  console.log('Data array:', response?.data);
  console.log('Data length:', response?.data?.length || 0);
  
  if (response?.data && Array.isArray(response.data)) {
    console.log('First item structure:', response.data[0]);
    console.log('Available fields:', Object.keys(response.data[0] || {}));
  }
  
  console.groupEnd();
};

// Validate that a marketplace listing has required fields
export const validateMarketplaceListing = (listing: any): boolean => {
  const requiredFields = ['ad_id', 'account_name'];
  const hasRequiredFields = requiredFields.every(field => listing[field] !== undefined);
  
  if (!hasRequiredFields) {
    console.warn('Missing required fields in listing:', {
      listing,
      missingFields: requiredFields.filter(field => listing[field] === undefined)
    });
  }
  
  return hasRequiredFields;
};
