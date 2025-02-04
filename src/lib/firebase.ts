import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  setPersistence, 
  browserLocalPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Enhanced config validation
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing required Firebase configuration fields:', missingFields);
    throw new Error(`Missing required Firebase configuration: ${missingFields.join(', ')}`);
  }
  
  console.log('Firebase Config Validation:', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    configComplete: true
  });
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;

try {
  console.log('Starting Firebase initialization...');
  validateConfig();

  // Initialize Firebase
  if (getApps().length === 0) {
    console.log('Initializing new Firebase app...');
    app = initializeApp(firebaseConfig);
  } else {
    console.log('Using existing Firebase app...');
    app = getApps()[0];
  }

  // Initialize Firestore with debugging
  console.log('Initializing Firestore...');
  db = getFirestore(app);
  
  // Enable offline persistence for Firestore
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log('Firestore offline persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        } else {
          console.error('Error enabling Firestore persistence:', err);
        }
      });
  }
  
  // Initialize Auth with enhanced error handling
  if (typeof window !== 'undefined') {
    try {
      console.log('Initializing Auth with IndexedDB persistence...');
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      });
      console.log('Firebase Auth initialized successfully with IndexedDB persistence');
    } catch (error) {
      console.warn('Failed to initialize with IndexedDB, falling back to default:', error);
      auth = getAuth(app);
    }
  } else {
    auth = getAuth(app);
  }

  storage = getStorage(app);

  // Set persistence with better error handling
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase Auth persistence set to LOCAL');
    })
    .catch((error) => {
      console.error('Detailed persistence error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.log('Falling back to default persistence');
    });

  // Initialize analytics with error handling
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize analytics:', error);
    }
  }

  console.log('Firebase initialization completed successfully');
} catch (error) {
  console.error('Critical error during Firebase initialization:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  throw error;
}

export { app, db, auth, storage, analytics }; 