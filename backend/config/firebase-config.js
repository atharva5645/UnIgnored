const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// To get the serviceAccountKey:
// 1. Go to Firebase Console > Project Settings > Service Accounts
// 2. Click "Generate new private key"
// 3. Save the JSON file and refer to it here OR use environment variables

let serviceAccount;

try {
    // Attempt to load from a local file (ignored by git)
    serviceAccount = require('../serviceAccountKey.json');
} catch (e) {
    // Fallback to environment variables for production/deployment
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        console.warn('Firebase Service Account not found. Backend Firebase features will be disabled.');
    }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` // Optional for Realtime DB
    });
    console.log('Firebase Admin initialized successfully');
}

const db = serviceAccount ? admin.firestore() : null;
const auth = serviceAccount ? admin.auth() : null;

module.exports = { admin, db, auth };
