# Verbalyst - Quick Reference Guide

## 📁 Project Structure

```
verbalyst/
├── src/
│   ├── components/           # React components
│   │   ├── Admin/           # Admin panel components
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── QuestionManager.tsx
│   │   │   └── SettingsManager.tsx
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Feedback.tsx     # Interview feedback page
│   │   ├── History.tsx      # Interview history
│   │   ├── Interview.tsx    # Interview interface
│   │   ├── Login.tsx        # Authentication page
│   │   ├── PaymentModal.tsx # Razorpay payment modal
│   │   └── TrackSelection.tsx # Fresher/Senior selection
│   ├── config/              # Configuration files
│   │   ├── constants.ts     # App constants
│   │   └── firebase.ts      # Firebase configuration
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── firestore.rules          # Firestore security rules
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── README.md               # Main documentation
├── SETUP_GUIDE.md          # Setup instructions
├── FEATURES.md             # Feature documentation
├── DEPLOYMENT.md           # Deployment guide
└── QUICK_REFERENCE.md      # This file
```

## 🔑 Key Files to Configure

### 1. Firebase Configuration
**File**: `src/config/firebase.ts`
```typescript
const firebaseConfig = {
  apiKey: "...",           // ← Update this
  authDomain: "...",       // ← Update this
  projectId: "...",        // ← Update this
  storageBucket: "...",    // ← Update this
  messagingSenderId: "...",// ← Update this
  appId: "..."            // ← Update this
};
```

### 2. Admin & API Settings
**File**: `src/config/constants.ts`
```typescript
export const ADMIN_EMAIL = '...';        // ← Your admin email
export const RAZORPAY_CONFIG = {
  keyId: '...'                          // ← Razorpay Key ID
};
export const GEMINI_API_KEY = '...';    // ← Gemini API key
```

### 3. Security Rules
**File**: `firestore.rules`
```javascript
// Update line 7 with your admin email
request.auth.token.email == 'YOUR_EMAIL@example.com'
```

## 🚀 Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Firebase
```bash
# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting
firebase deploy --only hosting

# View logs
firebase functions:log
```

## 🗺️ Application Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Redirect | Public | Redirects to dashboard |
| `/login` | Login | Public | Authentication page |
| `/dashboard` | Dashboard | Protected | Main dashboard with industries |
| `/track/:industryId` | TrackSelection | Protected | Fresher/Senior selection |
| `/interview/:industryId/:track` | Interview | Protected | Interview interface |
| `/feedback` | Feedback | Protected | AI feedback display |
| `/history` | History | Protected | Interview history |
| `/admin-verbalyst-portal` | AdminPanel | Admin Only | Admin dashboard |

## 🔐 User Flow

```
Login (Google/Phone)
    ↓
Dashboard (Select Industry)
    ↓
Track Selection (Fresher/Senior)
    ↓
Interview (Answer Questions)
    ↓
[Paywall if not premium & >2 questions]
    ↓
AI Feedback (Score + Tips)
    ↓
History (View Past Interviews)
```

## 💾 Firestore Collections

### `users`
```javascript
{
  uid: string,
  email: string | null,
  phoneNumber: string | null,
  displayName: string | null,
  isPremium: boolean,
  questionsAnswered: number,
  createdAt: timestamp
}
```

### `questions`
```javascript
{
  industry: string,          // e.g., 'bfsi', 'it-services'
  track: 'fresher' | 'senior',
  type: 'introduction' | 'technical' | 'behavioral' | 'closing',
  question: string,
  order: number
}
```

### `interviews`
```javascript
{
  userId: string,
  industry: string,
  industryName: string,
  track: 'fresher' | 'senior',
  answers: [{
    questionId: string,
    question: string,
    answer: string,
    type: string
  }],
  score: number,
  feedback: string,
  tips: string[],
  timestamp: timestamp,
  completed: boolean
}
```

### `settings`
```javascript
// Document ID: 'razorpay'
{
  razorpayKeyId: string,
  productPrice: number
}
```

## 🎨 Color Palette

```javascript
Royal Blue:  #002366  // Primary brand color
Gold:        #D4AF37  // Premium accents
White:       #FFFFFF  // Backgrounds
Light Gray:  #F5F5F5  // Secondary backgrounds
Dark Gray:   #333333  // Text
```

## 🏭 Industry IDs

```javascript
'bfsi'              → Banking & Finance
'bpo'               → BPO/ITES
'it-services'       → IT Services/SaaS
'ai-ml'             → AI & ML
'healthcare'        → Healthcare/Pharma
'ecommerce'         → E-commerce/Logistics
'manufacturing'     → Manufacturing/EV
'renewable-energy'  → Renewable Energy
'cybersecurity'     → Cybersecurity
'digital-marketing' → Digital Marketing
'travel'            → Travel/Hospitality
'edtech'            → EdTech
'real-estate'       → Real Estate
'fmcg'              → FMCG/Retail
'mental-health'     → Mental Health
```

## 🧪 Testing Credentials

### Razorpay Test Mode
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
OTP: Any 6 digits (for 3D Secure)
```

### Firebase Phone Auth (Test Numbers)
Add test phone numbers in Firebase Console → Authentication → Sign-in method → Phone → Test phone numbers
```
Phone: +91 1234567890
Code: 123456
```

## 🐛 Common Issues & Fixes

### Issue: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Firebase not initialized
```javascript
// Check src/config/firebase.ts has correct credentials
// Verify Firebase project is active
```

### Issue: Razorpay not loading
```html
<!-- Verify in index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue: Admin panel access denied
```javascript
// Verify logged-in email matches ADMIN_EMAIL
// Check browser console for auth errors
```

### Issue: Phone OTP not sending
```javascript
// Add domain to Firebase authorized domains
// Check reCAPTCHA is not blocked
// Verify phone number format (+91XXXXXXXXXX)
```

## 📊 Analytics Queries

### Get conversion rate
```javascript
const conversionRate = (premiumUsers / totalUsers) * 100;
```

### Get average revenue per user
```javascript
const arpu = totalRevenue / totalUsers;
```

### Get popular industries
```javascript
// Query interviews collection
// Group by industry
// Sort by count descending
```

## 🔧 Customization Tips

### Change Premium Price
**File**: `src/config/constants.ts`
```typescript
export const PREMIUM_PRICE = 299; // Change to any value
```

### Change Free Question Limit
**File**: `src/config/constants.ts`
```typescript
export const FREE_QUESTIONS_LIMIT = 2; // Change to any value
```

### Add New Industry
**File**: `src/config/constants.ts`
```typescript
export const INDUSTRIES = [
  // ... existing industries
  { id: 'new-industry', name: 'New Industry', icon: '🎯' }
];
```

### Modify Question Types
**File**: `src/config/constants.ts`
```typescript
export const QUESTION_TYPES = [
  'introduction',
  'technical',
  'behavioral',
  'closing',
  'your-new-type' // Add here
] as const;
```

## 📞 API Integration Examples

### Add Question via Admin Panel
1. Go to `/admin-verbalyst-portal`
2. Click "Questions" tab
3. Select industry and track
4. Enter question details
5. Click "Add Question"

### Process Payment
```javascript
// Handled automatically in PaymentModal.tsx
// Razorpay options are pre-configured
// Success handler updates Firestore
```

### Get AI Feedback
```javascript
// Automatically called in Interview.tsx
// Uses Gemini API with structured prompt
// Returns score and tips
```

## 🔒 Security Best Practices

1. **Never commit API keys** to Git
2. **Use environment variables** for sensitive data
3. **Enable Firebase App Check** in production
4. **Verify Razorpay webhooks** with signature
5. **Implement rate limiting** on expensive operations
6. **Keep dependencies updated** regularly
7. **Use HTTPS** in production
8. **Enable 2FA** for admin accounts

## 📈 Performance Tips

1. **Lazy load routes** for faster initial load
2. **Optimize images** before uploading
3. **Enable Firestore persistence** for offline support
4. **Use indexes** for complex queries
5. **Implement pagination** for large lists
6. **Cache API responses** where appropriate
7. **Minimize bundle size** with tree-shaking

## 🎓 Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Razorpay**: https://razorpay.com/docs/
- **Gemini API**: https://ai.google.dev/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

---

**Pro Tip**: Keep this file open while developing for quick reference!
