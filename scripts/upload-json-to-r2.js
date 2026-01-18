#!/usr/bin/env node

/**
 * Upload JSON file to Cloudflare R2
 *
 * Usage:
 *   node scripts/upload-json-to-r2.js
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
const FILE_KEY = 'saap-data.json';

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
  const filePath = path.join(__dirname, '..', 'data', 'saap-data.json');

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    console.error('\nRun `node scripts/convert-to-json.js` first to create the JSON file');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  console.log(`Uploading ${FILE_KEY} to R2 bucket: ${R2_BUCKET_NAME}...`);
  console.log(`  - ${data.initiatives.length} initiatives`);
  console.log(`  - ${data.events.length} events`);

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: FILE_KEY,
      Body: fileContent,
      ContentType: 'application/json',
    }));

    console.log('\nUpload successful!');
    console.log(`File available at: ${R2_BUCKET_NAME}/${FILE_KEY}`);
  } catch (error) {
    console.error('Upload failed:', error.message);
    process.exit(1);
  }
}

uploadFile();
