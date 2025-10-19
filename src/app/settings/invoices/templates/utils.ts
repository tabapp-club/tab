/**
 * Utility functions for invoice templates
 */

// Format INR currency
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Convert number to Indian words
export const amountInWordsINR = (amount: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (amount === 0) return 'Zero Rupees Only';

  const convertHundreds = (num: number): string => {
    let result = '';
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + ' ';
      return result.trim();
    }
    
    if (num > 0) {
      result += ones[num] + ' ';
    }
    
    return result.trim();
  };

  const convertToWords = (num: number): string => {
    if (num === 0) return '';
    
    let result = '';
    let scaleIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        if (scaleIndex > 0) {
          result = chunkWords + ' ' + scales[scaleIndex] + ' ' + result;
        } else {
          result = chunkWords;
        }
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
    
    return result.trim();
  };

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  let result = convertToWords(integerPart);
  
  if (integerPart === 1) {
    result += ' Rupee';
  } else {
    result += ' Rupees';
  }
  
  if (decimalPart > 0) {
    const paisaWords = convertToWords(decimalPart);
    if (decimalPart === 1) {
      result += ' and ' + paisaWords + ' Paisa';
    } else {
      result += ' and ' + paisaWords + ' Paise';
    }
  }
  
  return result + ' Only';
};

// Compute GST split based on business state vs place of supply
export const computeGSTSplit = (
  businessState: string,
  placeOfSupply: string,
  taxableAmount: number,
  gstRate: number = 18
): { cgst: number; sgst: number; igst: number; totalTax: number } => {
  const isIntraState = businessState.toLowerCase() === placeOfSupply.toLowerCase();
  const totalTax = (taxableAmount * gstRate) / 100;
  
  if (isIntraState) {
    // Intra-state: CGST + SGST
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;
    return { cgst, sgst, igst: 0, totalTax };
  } else {
    // Inter-state: IGST
    return { cgst: 0, sgst: 0, igst: totalTax, totalTax };
  }
};

// Validate GSTIN format
export const validateGSTIN = (gstin: string): boolean => {
  // GSTIN format: 2 digits (state code) + 10 characters (PAN) + 1 character (entity number) + 1 character (Z) + 1 character (checksum)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

// Validate PAN format
export const validatePAN = (pan: string): boolean => {
  // PAN format: 5 letters + 4 digits + 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Validate PIN code
export const validatePIN = (pin: string): boolean => {
  // Indian PIN code: 6 digits
  const pinRegex = /^[0-9]{6}$/;
  return pinRegex.test(pin);
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Indian mobile numbers: 10 digits starting with 6-9
  return /^[6-9]\d{9}$/.test(digits);
};

// Class names utility
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
