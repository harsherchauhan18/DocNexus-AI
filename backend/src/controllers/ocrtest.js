// ocr_space_test.js
// Usage:
//   node ocr_space_test.js
//
// Edit the constants below: API_KEY and IMAGE_PATH (or use env vars)

// Required packages
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// ===========================
// CONFIG — Replace these
// ===========================
const API_KEY = process.env.OCR_SPACE_API_KEY || "YOUR_OCR_SPACE_API_KEY"; // replace or set env OCR_SPACE_API_KEY
const IMAGE_PATH = process.env.IMAGE_PATH || "https://libapps.s3.amazonaws.com/accounts/194636/images/FindIt.png";       // path to local image file
const LANGUAGE = process.env.LANGUAGE || "eng";
const IS_OVERLAY_REQUIRED = process.env.IS_OVERLAY_REQUIRED === 'true' || false;
// ===========================

if (!API_KEY || API_KEY === "YOUR_OCR_SPACE_API_KEY") {
  console.warn("⚠️  Warning: OCR.space API key not set. Replace API_KEY in the file or set environment variable OCR_SPACE_API_KEY.");
}

// Helper: send file via multipart/form-data (recommended)
async function ocrSpaceFile(apiKey, imagePath, language = 'eng', overlay = false, detectOrientation = true) {
  const url = 'https://api.ocr.space/parse/image';
  const form = new FormData();

  form.append('apikey', apiKey);
  form.append('language', language);
  form.append('isOverlayRequired', String(overlay).toLowerCase());
  form.append('detectOrientation', String(detectOrientation).toLowerCase());

  // Attach file
  form.append('file', fs.createReadStream(imagePath), {
    filename: path.basename(imagePath)
  });

  const headers = form.getHeaders();

  // Increase timeout for large files
  const response = await axios.post(url, form, { headers, timeout: 120000 });
  return response;
}

async function ocrSpaceUrl(apiKey, imageUrl, language = 'eng', overlay = false, detectOrientation = true) {
  const url = 'https://api.ocr.space/parse/image';
  const form = new FormData();

  form.append('apikey', apiKey);
  form.append('language', language);
  form.append('isOverlayRequired', String(overlay).toLowerCase());
  form.append('detectOrientation', String(detectOrientation).toLowerCase());
  form.append('url', imageUrl);

  const headers = form.getHeaders();

  const response = await axios.post(url, form, { headers, timeout: 120000 });
  return response;
}

// Alternative: send base64 image in JSON (useful if you already have base64)
async function ocrSpaceBase64(apiKey, imagePath, language = 'eng', overlay = false, detectOrientation = true) {
  const url = 'https://api.ocr.space/parse/image';
  const buffer = fs.readFileSync(imagePath);
  const b64 = buffer.toString('base64');
  const payload = {
    base64Image: 'data:image/jpeg;base64,' + b64,
    apikey: apiKey,
    language: language,
    isOverlayRequired: overlay,
    detectOrientation: detectOrientation
  };

  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 120000
  });
  return response;
}

// Run
(async () => {
  try {
    console.log("Sending image to OCR.space...");

    const isRemote = /^https?:\/\//i.test(IMAGE_PATH);

    let res;
    if (isRemote) {
      res = await ocrSpaceUrl(API_KEY, IMAGE_PATH, LANGUAGE, IS_OVERLAY_REQUIRED);
    } else {
      if (!fs.existsSync(IMAGE_PATH)) {
        console.error("File not found:", IMAGE_PATH);
        process.exit(1);
      }
      // Choose which function to use:
      // const res = await ocrSpaceBase64(API_KEY, IMAGE_PATH, LANGUAGE, IS_OVERLAY_REQUIRED);
      res = await ocrSpaceFile(API_KEY, IMAGE_PATH, LANGUAGE, IS_OVERLAY_REQUIRED);
    }

    if (res.status !== 200) {
      console.error("HTTP error:", res.status);
      console.error("Response text:", res.data);
      process.exit(2);
    }

    const result = res.data;
  
    const parsedResults = result.ParsedResults;
    if (parsedResults && parsedResults.length > 0) {
      const allText = parsedResults.map(pr => pr.ParsedText || "").join("\n\n");
      const extractedText = allText.trim();
      console.log("\n=== EXTRACTED TEXT ===");
      if (extractedText.length > 0) console.log(extractedText);
      else console.log("(No text returned in ParsedResults. Check 'ErrorMessage' or 'ErrorDetails' in JSON.)");
    } else {
      console.log("\nNo 'ParsedResults' found. Response may contain error info:");
      console.log("ErrorMessage:", result.ErrorMessage);
      console.log("ErrorDetails:", result.ErrorDetails);
    }

  } catch (err) {
    if (err.response) {
      console.error("API returned error:", err.response.status, err.response.data);
    } else {
      console.error("Request failed:", err.message || err);
    }
  }
})();
