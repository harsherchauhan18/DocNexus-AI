/**
 * Sensitive Data Masking Service
 * Detects and masks sensitive information in documents
 */

// Regex patterns for common sensitive data
const patterns = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  zipCode: /\b\d{5}(-\d{4})?\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
  // Date patterns (MM/DD/YYYY, DD-MM-YYYY, etc.)
  date: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/g,
};

/**
 * Detects sensitive data in text
 * @param {string} text - The text to analyze
 * @returns {Object} - Object containing detected sensitive data types and their counts
 */
export const detectSensitiveData = (text) => {
  const detected = {};
  const matches = {};

  for (const [type, pattern] of Object.entries(patterns)) {
    const found = text.match(pattern);
    if (found && found.length > 0) {
      detected[type] = found.length;
      matches[type] = found;
    }
  }

  return {
    hasSensitiveData: Object.keys(detected).length > 0,
    detectedTypes: Object.keys(detected),
    counts: detected,
    matches,
  };
};

/**
 * Masks sensitive data in text
 * @param {string} text - The text to mask
 * @param {Object} options - Masking options
 * @returns {Object} - Masked text and metadata
 */
export const maskSensitiveData = (text, options = {}) => {
  const {
    maskEmail = true,
    maskPhone = true,
    maskSSN = true,
    maskCreditCard = true,
    maskZipCode = false,
    maskIPAddress = false,
    maskURL = false,
    maskDate = false,
    maskChar = "*",
  } = options;

  let maskedText = text;
  const maskedFields = [];

  // Email masking
  if (maskEmail && patterns.email.test(text)) {
    maskedText = maskedText.replace(patterns.email, (match) => {
      const [local, domain] = match.split("@");
      return `${local[0]}${maskChar.repeat(local.length - 1)}@${domain}`;
    });
    maskedFields.push("email");
  }

  // Phone masking
  if (maskPhone && patterns.phone.test(text)) {
    maskedText = maskedText.replace(
      patterns.phone,
      `${maskChar.repeat(3)}-${maskChar.repeat(3)}-${maskChar.repeat(4)}`
    );
    maskedFields.push("phone");
  }

  // SSN masking
  if (maskSSN && patterns.ssn.test(text)) {
    maskedText = maskedText.replace(
      patterns.ssn,
      `${maskChar.repeat(3)}-${maskChar.repeat(2)}-${maskChar.repeat(4)}`
    );
    maskedFields.push("ssn");
  }

  // Credit card masking
  if (maskCreditCard && patterns.creditCard.test(text)) {
    maskedText = maskedText.replace(patterns.creditCard, (match) => {
      const digits = match.replace(/[-\s]/g, "");
      return `${maskChar.repeat(12)}${digits.slice(-4)}`;
    });
    maskedFields.push("creditCard");
  }

  // Zip code masking
  if (maskZipCode && patterns.zipCode.test(text)) {
    maskedText = maskedText.replace(
      patterns.zipCode,
      `${maskChar.repeat(5)}`
    );
    maskedFields.push("zipCode");
  }

  // IP address masking
  if (maskIPAddress && patterns.ipAddress.test(text)) {
    maskedText = maskedText.replace(patterns.ipAddress, (match) => {
      const parts = match.split(".");
      return `${parts[0]}.${parts[1]}.${maskChar.repeat(3)}.${maskChar.repeat(3)}`;
    });
    maskedFields.push("ipAddress");
  }

  // URL masking
  if (maskURL && patterns.url.test(text)) {
    maskedText = maskedText.replace(patterns.url, "[URL REDACTED]");
    maskedFields.push("url");
  }

  // Date masking
  if (maskDate && patterns.date.test(text)) {
    maskedText = maskedText.replace(patterns.date, "[DATE REDACTED]");
    maskedFields.push("date");
  }

  const detection = detectSensitiveData(text);

  return {
    maskedText,
    originalText: text,
    hasSensitiveData: detection.hasSensitiveData,
    maskedFields: [...new Set(maskedFields)],
    detectedTypes: detection.detectedTypes,
    counts: detection.counts,
  };
};

/**
 * Process document text for sensitive data
 * @param {string} text - Document text
 * @returns {Promise<Object>} - Processing result
 */
export const processDocumentForSensitiveData = async (text) => {
  try {
    // First detect what sensitive data exists
    const detection = detectSensitiveData(text);

    // Then mask the sensitive data
    const maskingResult = maskSensitiveData(text, {
      maskEmail: true,
      maskPhone: true,
      maskSSN: true,
      maskCreditCard: true,
      maskZipCode: false,
      maskIPAddress: false,
      maskURL: false,
      maskDate: false,
    });

    return {
      success: true,
      ...maskingResult,
    };
  } catch (error) {
    console.error("Error processing document for sensitive data:", error);
    return {
      success: false,
      error: error.message,
      maskedText: text,
      hasSensitiveData: false,
      maskedFields: [],
    };
  }
};
