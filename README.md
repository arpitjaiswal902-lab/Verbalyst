# Verbalyst - Premium Interview Preparation Platform

A high-end, full-stack web application for interview preparation built with React, Firebase, and Razorpay.

## Features

### 🎯 Core Features
- **Premium Branding**: Luxury Tech aesthetic with Royal Blue (#002366) and Gold (#D4AF37)
- **Authentication**: Google Sign-In and Phone OTP via Firebase
- **15 Industry Tracks**: Covering India's most demanding sectors
- **Dual Difficulty Levels**: Fresher and Senior tracks for each industry
- **AI-Powered Feedback**: Gemini API integration for personalized interview analysis
- **Payment Integration**: Razorpay for premium subscriptions (₹299)
- **Progress Tracking**: Complete interview history for all users

### 🔒 Security & Access
- **Freemium Model**: 2 free questions, then premium paywall
- **Protected Admin Panel**: Secure route `/admin-verbalyst-portal`
- **Firebase Security Rules**: Only admin can modify questions

### 👨‍💼 Admin Features
- **Question Management**: Add, edit, delete questions for all industries
- **Payment Control**: Update Razorpay settings and pricing
- **Analytics Dashboard**: User metrics and revenue tracking

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Enable Phone provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web icon
   - Copy the configuration object

6. Update `src/config/firebase.ts` with your Firebase config:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Firestore Security Rules

Go to Firestore Database > Rules and add:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone authenticated can read questions
    match /questions/{questionId} {
      allow read: if request.auth != null;
      // Only admin can write (replace with your admin email)
      allow write: if request.auth != null && request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
    
    // Users can read/write their own interviews
    match /interviews/{interviewId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Settings - only admin can write
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
  }
}
```

### 3. Razorpay Configuration

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API Key ID from Dashboard > Settings > API Keys
3. Update `src/config/constants.ts`:
```typescript
export const RAZORPAY_CONFIG = {
  keyId: 'rzp_live_xxxxxxxxxxxxx', // Your Razorpay Key ID
  keySecret: 'YOUR_RAZORPAY_KEY_SECRET'
};
```

### 4. Gemini API Configuration

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `src/config/constants.ts`:
```typescript
export const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```

### 5. Admin Email Configuration

Update `src/config/constants.ts` with your admin email:
```typescript
export const ADMIN_EMAIL = 'your-admin-email@example.com';
```

### 6. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage Guide

### For Users

1. **Login**: Use Google or Phone OTP to sign in
2. **Select Industry**: Choose from 15 industry options
3. **Select Track**: Pick Fresher or Senior level
4. **Answer Questions**: Complete 4 types of questions chronologically:
   - Introduction
   - Technical
   - Behavioral
   - Closing
5. **Get Feedback**: Receive AI-powered analysis with score (1-10) and 3 tips
6. **Upgrade to Premium**: After 2 free questions, upgrade for ₹299 for unlimited access
7. **Track Progress**: View all past interviews in History

### For Admin

1. **Access Admin Panel**: Navigate to `/admin-verbalyst-portal`
2. **Manage Questions**: 
   - Add new questions for any industry/track
   - Edit existing questions
   - Delete outdated questions
3. **Update Settings**:
   - Change Razorpay API keys
   - Modify premium pricing
4. **View Analytics**:
   - Total users
   - Premium conversions
   - Revenue metrics
   - Conversion rates

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **AI**: Google Gemini API
- **Payments**: Razorpay
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Industries Covered

1. Banking & Finance (BFSI)
2. BPO/ITES
3. IT Services/SaaS
4. AI & ML
5. Healthcare/Pharma
6. E-commerce/Logistics
7. Manufacturing/EV
8. Renewable Energy
9. Cybersecurity
10. Digital Marketing
11. Travel/Hospitality
12. EdTech
13. Real Estate
14. FMCG/Retail
15. Mental Health

## Support

For issues or questions, please contact the admin.

## License

Proprietary - All rights reserved
