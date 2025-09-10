/**
 * Script to migrate data from Google Sheets to Firestore.
 *
 * Usage: set environment variables SHEET_ID and GOOGLE_APPLICATION_CREDENTIALS.
 * Optionally DRIVER_RANGE and PICKUP_RANGE for the sheet ranges.
 */

const { google } = require('googleapis');
const admin = require('firebase-admin');
require('dotenv').config();

const sheetId = process.env.SHEET_ID;
const driverRange = process.env.DRIVER_RANGE || 'Drivers!A2:E';
const pickupRange = process.env.PICKUP_RANGE || 'PickupPoints!A2:E';

if (!sheetId) {
  console.error('Missing SHEET_ID environment variable');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
});

const firestore = admin.firestore();

async function loadSheet(range) {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range });
  return res.data.values || [];
}

function rowToDoc(row, fields) {
  const doc = {};
  fields.forEach((f, i) => {
    doc[f] = row[i];
  });
  return doc;
}

async function migrate() {
  const driverRows = await loadSheet(driverRange);
  const driverFields = ['id', 'name', 'phone', 'address', 'status'];
  for (const row of driverRows) {
    const doc = rowToDoc(row, driverFields);
    await firestore.collection('drivers').doc(doc.id).set(doc);
  }

  const pickupRows = await loadSheet(pickupRange);
  const pickupFields = ['id', 'name', 'address', 'city', 'status'];
  for (const row of pickupRows) {
    const doc = rowToDoc(row, pickupFields);
    await firestore.collection('pickupPoints').doc(doc.id).set(doc);
  }

  console.log('Migration complete');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
