/**
 * @fileOverview Institutional GST Calculation Engine for AeroDesk.
 * Handles state-based tax determination (IGST vs CGST/SGST) and GSTIN validation.
 */

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * Validates a GSTIN against the standard 15-character structure.
 */
export function validateGSTIN(gstin: string): boolean {
  return GSTIN_REGEX.test(gstin.toUpperCase());
}

export interface TaxBreakup {
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
}

/**
 * Calculates GST breakup based on seller and buyer states.
 * If states match: CGST + SGST (50/50 split of the total rate).
 * If states differ: IGST (Full rate).
 */
export function calculateTax(
  amount: number,
  sellerStateCode: string,
  buyerStateCode: string,
  taxRatePercent: number
): TaxBreakup {
  const isIntraState = sellerStateCode.slice(0, 2) === buyerStateCode.slice(0, 2);
  const totalTaxRate = taxRatePercent / 100;
  const totalTax = amount * totalTaxRate;

  if (isIntraState) {
    const splitTax = totalTax / 2;
    return {
      taxableAmount: amount,
      cgstAmount: splitTax,
      sgstAmount: splitTax,
      igstAmount: 0,
      totalTax,
      totalAmount: amount + totalTax
    };
  } else {
    return {
      taxableAmount: amount,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: totalTax,
      totalTax,
      totalAmount: amount + totalTax
    };
  }
}

/**
 * Institutional State Codes for India
 */
export const INDIAN_STATE_CODES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "27": "Maharashtra",
  "28": "Andhra Pradesh",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh (New)",
  "38": "Ladakh"
};
