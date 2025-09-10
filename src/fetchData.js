import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchData() {
  const driversSnap = await getDocs(collection(db, 'drivers'));
  const pickupSnap = await getDocs(collection(db, 'pickupPoints'));

  const drivers = driversSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const pickupPoints = pickupSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return { drivers, pickupPoints };
}
