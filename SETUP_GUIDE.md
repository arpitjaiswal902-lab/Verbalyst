# Verbalyst - Complete Setup Guide

## Quick Configuration Checklist

Before running the application, you need to configure the following:

### 1️⃣ Firebase Setup (REQUIRED)

**File**: `src/config/firebase.ts`

Replace these values:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // ← Replace
  authDomain: "YOUR_AUTH_DOMAIN",            // ← Replace
  projectId: "YOUR_PROJECT_ID",              // ← Replace
  storageBucket: "YOUR_STORAGE_BUCKET",      // ← Replace
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← Replace
  appId: "YOUR_APP_ID"                       // ← Replace
};
```

**How to get these values:**
1. Go to https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Click on "Web" icon (</>) to add a web app
4. Copy the configuration object

### 2️⃣ Admin Email Configuration (REQUIRED)

**File**: `src/config/constants.ts`

Replace this value:
```typescript
export const ADMIN_EMAIL = 'YOUR_ADMIN_EMAIL@example.com'; // ← Replace with your email
```

This email will have access to `/admin-verbalyst-portal`

### 3️⃣ Razorpay Configuration (REQUIRED for Payments)

**File**: `src/config/constants.ts`

Replace these values:
```typescript
export const RAZORPAY_CONFIG = {
  keyId: 'YOUR_RAZORPAY_KEY_ID',           // ← Replace
  keySecret: 'YOUR_RAZORPAY_KEY_SECRET'    // ← Replace (only for reference)
};
```

**How to get these values:**
1. Sign up at https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Generate API keys
4. Copy Key ID (starts with `rzp_test_` or `rzp_live_`)

**Note**: For testing, use Test Mode keys. For production, use Live Mode keys.

### 4️⃣ Gemini API Configuration (REQUIRED for AI Feedback)

**File**: `src/config/constants.ts`

Replace this value:
```typescript
export const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // ← Replace
```

**How to get this:**
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Copy the key

### 5️⃣ Firebase Authentication Setup

1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable **Google** sign-in:
   - Click on Google provider
   - Toggle to enable
   - Add your support email
   - Save
4. Enable **Phone** sign-in:
   - Click on Phone provider
   - Toggle to enable
   - Save

### 6️⃣ Firebase Firestore Setup

1. Go to Firebase Console → Firestore Database
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your region
5. Click "Enable"

### 7️⃣ Firestore Security Rules

Go to Firestore Database → Rules tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Questions collection - read for all, write only for admin
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
    
    // Interviews collection
    match /interviews/{interviewId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Settings collection - admin only
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
  }
}
```

**Important**: Replace `YOUR_ADMIN_EMAIL@example.com` with your actual admin email.

## Testing the Setup

### Test Firebase Authentication
1. Run `npm run dev`
2. Try logging in with Google
3. Try logging in with Phone (use your real phone number)

### Test Payment (Test Mode)
1. Use Razorpay Test Mode keys
2. Try to answer more than 2 questions
3. When payment modal appears, use test card:
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

### Test Admin Access
1. Login with the email you set as ADMIN_EMAIL
2. Navigate to `/admin-verbalyst-portal`
3. You should see the admin dashboard

## Common Issues & Solutions

### Issue: "Firebase not initialized"
**Solution**: Make sure you've updated `src/config/firebase.ts` with your Firebase config

### Issue: "Admin access denied"
**Solution**: Ensure your logged-in email matches ADMIN_EMAIL in `src/config/constants.ts`

### Issue: "Razorpay not loading"
**Solution**: Check that Razorpay script is loaded in `index.html` and you've set the correct Key ID

### Issue: "Phone OTP not working"
**Solution**: 
1. Ensure Phone authentication is enabled in Firebase Console
2. Add your phone number to test numbers if in development
3. Check Firebase App Check settings

### Issue: "AI feedback not working"
**Solution**: Verify your Gemini API key is correct and has quota available

## Production Deployment Checklist

Before deploying to production:

- [ ] Replace all Firebase test credentials with production credentials
- [ ] Switch Razorpay from Test Mode to Live Mode
- [ ] Verify Gemini API key has sufficient quota
- [ ] Update Firestore security rules with production admin email
- [ ] Test all payment flows with real cards
- [ ] Set up Firebase App Check for bot protection
- [ ] Configure custom domain for Firebase Auth
- [ ] Enable Firebase Analytics
- [ ] Set up backup for Firestore
- [ ] Configure monitoring and alerts

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env` file in root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_ADMIN_EMAIL=your_admin_email
```

2. Update config files to use `import.meta.env.VITE_*` instead of hardcoded values

3. Add `.env` to `.gitignore`

## Support

For detailed Firebase documentation: https://firebase.google.com/docs
For Razorpay integration: https://razorpay.com/docs/
For Gemini API: https://ai.google.dev/docs

---

**Ready to go?** After completing all configurations, run:
```bash
npm install
npm run dev
```

Your app will be available at `http://localhost:5173`
