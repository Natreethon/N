# Firestore Migration Example

This repository contains scripts and configuration for migrating driver and pickup point data from Google Sheets to Firestore and fetching the data directly from Firestore in a client app.

## Migrate Google Sheet to Firestore

Run the script:

```bash
SHEET_ID=<sheet-id> \
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json \
node scripts/migrateSheetToFirestore.js
```

The script expects two sheets named `Drivers` and `PickupPoints` with columns:

- `Drivers`: `id`, `name`, `phone`, `address`, `status`
- `PickupPoints`: `id`, `name`, `address`, `city`, `status`

## Fetch Data in Client

`src/fetchData.js` exposes a `fetchData` function that reads both collections using Firestore's `getDocs`.

Set the following environment variables for Firebase configuration:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`

## Security Rules and Indexes

- `firestore.rules` defines basic authenticated read/write access for the new collections.
- `firestore.indexes.json` contains sample composite indexes for common queries.
