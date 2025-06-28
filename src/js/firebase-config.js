// Firebase Configuration
const firebaseConfig = {
  // আপনার Firebase প্রজেক্টের কনফিগারেশন এখানে যোগ করুন
  // এটি Firebase Console থেকে পাবেন
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firebase Initialize করুন
firebase.initializeApp(firebaseConfig);

// Auth instance
const auth = firebase.auth();

// Auth state persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Bengali language support
auth.languageCode = 'bn';

// Export for use in other files
window.firebaseAuth = auth;
window.firebase = firebase;

console.log('Firebase initialized successfully');