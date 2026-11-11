import { PINCODE_DELIVERY_DATA } from '../data/products';

export interface PincodeValidationResult {
  isValid: boolean;
  city?: string;
  state?: string;
  days?: number;
  codAvailable?: boolean;
  message: string;
}

// Legitimate 2-digit postal circle prefixes assigned by India Post
export const VALID_INDIAN_PINCODE_PREFIXES: Record<number, string> = {
  11: 'Delhi',
  12: 'Haryana',
  13: 'Haryana',
  14: 'Punjab',
  15: 'Punjab',
  16: 'Punjab & Chandigarh',
  17: 'Himachal Pradesh',
  18: 'Jammu & Kashmir',
  19: 'Jammu & Kashmir & Ladakh',
  20: 'Uttar Pradesh',
  21: 'Uttar Pradesh',
  22: 'Uttar Pradesh',
  23: 'Uttar Pradesh',
  24: 'Uttar Pradesh & Uttarakhand',
  25: 'Uttar Pradesh',
  26: 'Uttar Pradesh & Uttarakhand',
  27: 'Uttar Pradesh',
  28: 'Uttar Pradesh',
  30: 'Rajasthan',
  31: 'Rajasthan',
  32: 'Rajasthan',
  33: 'Rajasthan',
  34: 'Rajasthan',
  36: 'Gujarat',
  37: 'Gujarat',
  38: 'Gujarat',
  39: 'Gujarat, Daman & Diu, Dadra & Nagar Haveli',
  40: 'Maharashtra & Goa',
  41: 'Maharashtra',
  42: 'Maharashtra',
  43: 'Maharashtra',
  44: 'Maharashtra',
  45: 'Madhya Pradesh',
  46: 'Madhya Pradesh',
  47: 'Madhya Pradesh',
  48: 'Madhya Pradesh',
  49: 'Chhattisgarh',
  50: 'Telangana',
  51: 'Andhra Pradesh',
  52: 'Andhra Pradesh',
  53: 'Andhra Pradesh',
  56: 'Karnataka',
  57: 'Karnataka',
  58: 'Karnataka',
  59: 'Karnataka',
  60: 'Tamil Nadu & Puducherry',
  61: 'Tamil Nadu',
  62: 'Tamil Nadu',
  63: 'Tamil Nadu',
  64: 'Tamil Nadu',
  67: 'Kerala & Lakshadweep',
  68: 'Kerala',
  69: 'Kerala',
  70: 'West Bengal',
  71: 'West Bengal',
  72: 'West Bengal',
  73: 'West Bengal & Sikkim',
  74: 'West Bengal & Andaman and Nicobar',
  75: 'Odisha',
  76: 'Odisha',
  77: 'Odisha',
  78: 'Assam',
  79: 'North East (Meghalaya, Mizoram, Tripura, Nagaland, Manipur, Arunachal Pradesh)',
  80: 'Bihar',
  81: 'Bihar & Jharkhand',
  82: 'Jharkhand',
  83: 'Jharkhand',
  84: 'Bihar',
  85: 'Bihar',
  90: 'Army Postal Service',
  91: 'Army Postal Service',
  92: 'Army Postal Service',
  93: 'Army Postal Service',
  94: 'Army Postal Service',
  95: 'Army Postal Service',
  96: 'Army Postal Service',
  97: 'Army Postal Service',
  98: 'Army Postal Service',
  99: 'Army Postal Service',
};

// Test / dummy repeated number sequences
const INVALID_DUMMY_PATTERNS = new Set([
  '000000',
  '111111',
  '222222',
  '333333',
  '444444',
  '555555',
  '666666',
  '777777',
  '888888',
  '999999',
  '123456',
  '654321',
  '123123',
  '987654',
  '012345',
]);

/**
 * Validates whether a provided string represents an authentic 6-digit Indian PIN code.
 */
export function validateIndianPincode(rawInput: string): PincodeValidationResult {
  const pincode = rawInput.trim();

  // 1. Must be provided
  if (!pincode) {
    return {
      isValid: false,
      message: 'Please fill your 6-digit Indian PIN code properly.',
    };
  }

  // 2. Must only contain digits
  if (!/^\d+$/.test(pincode)) {
    return {
      isValid: false,
      message: 'PIN code must contain numbers only. Please fill PIN code properly.',
    };
  }

  // 3. Must be exactly 6 digits
  if (pincode.length !== 6) {
    return {
      isValid: false,
      message: `PIN code must be exactly 6 digits (entered ${pincode.length}). Please fill PIN code properly.`,
    };
  }

  // 4. Indian PIN codes cannot start with 0
  if (pincode.startsWith('0')) {
    return {
      isValid: false,
      message: 'Invalid Indian PIN code: Indian PIN codes cannot start with 0. Please fill PIN code properly.',
    };
  }

  // 5. Test/dummy patterns rejection
  if (INVALID_DUMMY_PATTERNS.has(pincode)) {
    return {
      isValid: false,
      message: `"${pincode}" is an invalid/test sequence. Please fill your genuine Indian postal PIN code properly.`,
    };
  }

  // 6. Check postal circle prefix
  const prefix = parseInt(pincode.slice(0, 2), 10);
  const region = VALID_INDIAN_PINCODE_PREFIXES[prefix];

  if (!region) {
    return {
      isValid: false,
      message: `Postal circle "${pincode.slice(0, 2)}" is not a valid India Post zone. Please fill an authentic Indian PIN code properly.`,
    };
  }

  // 7. Check if we have exact city metadata
  const exactData = PINCODE_DELIVERY_DATA[pincode];
  if (exactData) {
    return {
      isValid: true,
      city: exactData.city,
      state: exactData.state,
      days: exactData.days,
      codAvailable: exactData.codAvailable,
      message: `Delivery in ${exactData.days} days to ${exactData.city}, ${exactData.state}. Cash on Delivery available!`,
    };
  }

  // 8. Valid authentic Indian PIN code in recognized postal region
  return {
    isValid: true,
    state: region,
    days: 3,
    codAvailable: true,
    message: `Delivery available to ${region} (PIN ${pincode}) within 3–4 business days. Free shipping on orders above ₹499.`,
  };
}
