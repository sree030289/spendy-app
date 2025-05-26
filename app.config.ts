import 'dotenv/config';

export default {
  expo: {
    name: "Spendy",
    slug: "spendy-app", 
    version: "1.0.0",
    platforms: ["ios", "android"],
    ios: {
      bundleIdentifier: "com.yourcompany.spendyapp"
    },
    android: {
      package: "com.yourcompany.spendyapp"
    },
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    }
  }
};