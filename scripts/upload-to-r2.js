#!/usr/bin/env node

/**
 * Upload Excel file to Cloudflare R2
 *
 * Usage:
 *   node scripts/upload-to-r2.js
 *
 * Required environment variables:
 *   R2_ACCOUNT_ID - Your Cloudflare account ID
 *   R2_ACCESS_KEY_ID - R2 API token access key
 *   R2_SECRET_ACCESS_KEY - R2 API token secret key
 *   R2_BUCKET_NAME - R2 bucket name (default: motionvii-saap)
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'motionvii-saap';
const FILE_KEY = 'MotionVii_SAAP_2026.xlsx';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing required environment variables:');
  console.error('  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  console.error('\nSet these in your environment or create a .env file');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadFile() {
  const filePath = path.join(__dirname, '..', 'data', 'MotionVii_SAAP_2026.xlsx');

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);

  console.log(`Uploading ${FILE_KEY} to R2 bucket: ${R2_BUCKET_NAME}...`);

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: FILE_KEY,
      Body: fileBuffer,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }));

    console.log('Upload successful!');
    console.log(`File available at: ${R2_BUCKET_NAME}/${FILE_KEY}`);
  } catch (error) {
    console.error('Upload failed:', error.message);
    process.exit(1);
  }
}

uploadFile();
