# Verbalyst - Troubleshooting Guide

## 🔍 Debugging Tools

### Browser Console
Always check the browser console (F12) for errors:
- **Red errors**: Critical issues that need fixing
- **Yellow warnings**: Non-critical but should be addressed
- **Blue info**: Helpful debugging information

### Firebase Console
Monitor real-time activity:
- **Authentication**: Active users, sign-in methods
- **Firestore**: Database queries, document counts
- **Analytics**: User behavior, conversion metrics

### Network Tab
Check API calls and responses:
- Verify Firebase requests are successful
- Check Razorpay script loading
- Monitor Gemini API calls

## 🚨 Common Errors

### Authentication Errors

#### Error: "Firebase: Error (auth/popup-blocked)"
**Cause**: Browser blocked the popup window
**Solution**:
```javascript
// User action required
// Ask user to allow popups for your site
// Alternative: Use redirect instead of popup
import { signInWithRedirect } from 'firebase/auth';
await signInWithRedirect(auth, googleProvider);
```

#### Error: "Firebase: Error (auth/unauthorized-domain)"
**Cause**: Domain not authorized in Firebase
**Solution**:
1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add your domain
3. For local development, `localhost` should already be there

#### Error: "reCAPTCHA verification failed"
**Cause**: reCAPTCHA not configured or blocked
**Solution**:
1. Check if invisible reCAPTCHA element exists in DOM
2. Verify domain is authorized in Firebase
3. Try in incognito mode to rule out extensions
4. Add test phone numbers in Firebase Console for development

#### Error: "Invalid phone number"
**Cause**: Phone number format incorrect
**Solution**:
```javascript
// Ensure format: +91XXXXXXXXXX
const formattedPhone = phoneNumber.startsWith('+91') 
  ? phoneNumber 
  : `+91${phoneNumber}`;
```

### Firestore Errors

#### Error: "Missing or insufficient permissions"
**Cause**: Security rules blocking the operation
**Solution**:
1. Check Firestore rules match template in `firestore.rules`
2. Verify user is authenticated
3. For admin operations, verify email matches ADMIN_EMAIL
```javascript
// Debug: Log current user email
console.log('Current user:', auth.currentUser?.email);
console.log('Admin email:', ADMIN_EMAIL);
```

#### Error: "FirebaseError: No document to update"
**Cause**: Trying to update non-existent document
**Solution**:
```javascript
// Check if document exists first
const docRef = doc(db, 'collection', 'docId');
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  await updateDoc(docRef, data);
} else {
  await setDoc(docRef, data);
}
```

#### Error: "Quota exceeded"
**Cause**: Too many read/write operations
**Solution**:
1. Implement pagination for large queries
2. Use `.limit()` in queries
3. Cache frequently accessed data
4. Upgrade Firebase plan if needed

### Payment Errors

#### Error: "Razorpay is not defined"
**Cause**: Razorpay script not loaded
**Solution**:
```html
<!-- Verify in index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<!-- Add error handling -->
if (typeof window.Razorpay === 'undefined') {
  console.error('Razorpay script not loaded');
}
```

#### Error: "Invalid key_id"
**Cause**: Wrong Razorpay Key ID
**Solution**:
1. Verify Key ID in `src/config/constants.ts`
2. Ensure using correct mode (Test vs Live)
3. Check for extra spaces or characters
```javascript
// Test mode: rzp_test_xxxxxxxxxxxxx
// Live mode: rzp_live_xxxxxxxxxxxxx
```

#### Error: "Payment failed"
**Cause**: Various reasons (insufficient funds, card declined, etc.)
**Solution**:
1. For testing, use Razorpay test cards
2. Check Razorpay Dashboard for detailed error
3. Implement proper error handling:
```javascript
handler: function (response) {
  // Success
},
modal: {
  ondismiss: function() {
    alert('Payment cancelled');
  }
}
```

### AI/Gemini Errors

#### Error: "API key not valid"
**Cause**: Invalid or expired Gemini API key
**Solution**:
1. Verify key in `src/config/constants.ts`
2. Check key hasn't expired
3. Ensure key has proper permissions
4. Generate new key if needed

#### Error: "Quota exceeded"
**Cause**: Too many API calls
**Solution**:
1. Check quota in Google AI Studio
2. Implement rate limiting
3. Cache responses where possible
4. Consider upgrading quota

#### Error: "Invalid model"
**Cause**: Model name incorrect
**Solution**:
```javascript
// Use correct model name
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
// Not: 'gemini-1.5' or other variants
```

### Build Errors

#### Error: "Module not found"
**Cause**: Missing dependency or incorrect import
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check import paths
# Correct: import { X } from './components/X'
# Wrong: import { X } from 'components/X'
```

#### Error: "TypeScript errors in build"
**Cause**: Type mismatches or missing types
**Solution**:
```bash
# Check specific file mentioned in error
# Fix type issues
# Common fixes:

// Add type assertion
const value = someValue as SomeType;

// Make property optional
interface MyType {
  property?: string;
}

// Use non-null assertion (if you're sure)
const value = maybeNull!;
```

#### Error: "Out of memory"
**Cause**: Build process using too much RAM
**Solution**:
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

## 🔧 Configuration Issues

### Admin Panel Not Accessible

**Symptoms**: Redirected to dashboard when accessing `/admin-verbalyst-portal`

**Debug Steps**:
1. Check logged-in email:
```javascript
// In browser console
console.log(auth.currentUser?.email);
```

2. Check ADMIN_EMAIL:
```javascript
import { ADMIN_EMAIL } from './config/constants';
console.log(ADMIN_EMAIL);
```

3. Verify emails match exactly (case-sensitive):
```javascript
// In AdminPanel.tsx, add logging
console.log('Current:', currentUser?.email);
console.log('Admin:', ADMIN_EMAIL);
console.log('Match:', currentUser?.email === ADMIN_EMAIL);
```

**Solution**: Update ADMIN_EMAIL to match your authenticated email

### Paywall Not Working

**Symptoms**: Users can answer more than 2 questions for free

**Debug Steps**:
1. Check user's questionsAnswered count:
```javascript
console.log('Questions answered:', userData?.questionsAnswered);
console.log('Is Premium:', userData?.isPremium);
```

2. Verify increment function is called:
```javascript
// In Interview.tsx
await incrementQuestionsAnswered();
console.log('Incremented questions count');
```

3. Check FREE_QUESTIONS_LIMIT:
```javascript
import { FREE_QUESTIONS_LIMIT } from './config/constants';
console.log('Free limit:', FREE_QUESTIONS_LIMIT);
```

**Solution**: Ensure `incrementQuestionsAnswered()` is called after each answer

### Routes Not Working

**Symptoms**: 404 errors or blank pages on navigation

**Debug Steps**:
1. Check React Router is properly configured
2. Verify route definitions in App.tsx
3. Check for typos in navigation links

**Solution**:
```javascript
// Correct navigation
navigate(`/track/${industryId}`);

// Check Router is wrapping App
<Router>
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
</Router>
```

## 🎨 UI/Display Issues

### Styles Not Loading

**Symptoms**: Plain HTML without styling

**Debug Steps**:
1. Check if Tailwind CSS is imported:
```javascript
// In src/main.tsx or src/index.css
import './index.css';
```

2. Verify index.css has Tailwind import:
```css
@import "tailwindcss";
```

3. Clear browser cache (Ctrl+Shift+R)

**Solution**: Rebuild project and hard refresh browser

### Responsive Issues

**Symptoms**: Layout broken on mobile/tablet

**Debug Steps**:
1. Use browser DevTools device emulation
2. Check viewport meta tag in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

3. Test breakpoints:
```javascript
// Tailwind breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

**Solution**: Use responsive classes:
```javascript
className="w-full md:w-1/2 lg:w-1/3"
```

### Icons Not Showing

**Symptoms**: Missing lucide-react icons

**Debug Steps**:
1. Verify lucide-react is installed:
```bash
npm list lucide-react
```

2. Check import:
```javascript
import { IconName } from 'lucide-react';
```

**Solution**:
```bash
npm install lucide-react
```

## 📊 Data Issues

### Interview History Empty

**Symptoms**: No interviews showing in history page

**Debug Steps**:
1. Check Firestore collection:
   - Go to Firebase Console → Firestore
   - Look for 'interviews' collection
   - Verify documents exist with your userId

2. Check query:
```javascript
console.log('Current user ID:', currentUser?.uid);
const q = query(
  collection(db, 'interviews'),
  where('userId', '==', currentUser!.uid)
);
```

3. Verify security rules allow reading

**Solution**: Complete an interview and check if it saves

### Questions Not Loading

**Symptoms**: No questions in interview or empty state

**Debug Steps**:
1. Check 'questions' collection in Firestore
2. Verify questions exist for the industry/track
3. Check query filters:
```javascript
where('industry', '==', industryId)
where('track', '==', track)
```

**Solution**: Use admin panel to add questions, or they'll be auto-created on first access

### User Data Not Syncing

**Symptoms**: Premium status not updating, question count wrong

**Debug Steps**:
1. Check Firestore 'users' collection
2. Verify document ID matches user's UID
3. Check for console errors during updates

**Solution**:
```javascript
// Force refresh user data
await loadUserData(currentUser.uid);

// Or reload the page
window.location.reload();
```

## 🌐 Deployment Issues

### Firebase Hosting Not Updating

**Symptoms**: Old version still showing after deployment

**Debug Steps**:
1. Clear browser cache
2. Check deployment status:
```bash
firebase hosting:channel:list
```

3. Verify correct build uploaded

**Solution**:
```bash
# Build fresh
npm run build

# Deploy with force
firebase deploy --only hosting --force

# Clear CDN cache (if using)
```

### Environment Variables Not Working

**Symptoms**: Config values showing as undefined

**Debug Steps**:
1. Check variable names start with `VITE_`
2. Verify .env file is in project root
3. Restart dev server after changing .env

**Solution**:
```javascript
// Access with import.meta.env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Not process.env (that's for Node.js)
```

### CORS Errors

**Symptoms**: "CORS policy" errors in console

**Debug Steps**:
1. Check if accessing from authorized domain
2. Verify Firebase CORS settings
3. Check API CORS configuration

**Solution**:
1. Add domain to Firebase authorized domains
2. For local dev, use localhost:5173
3. Ensure API allows your domain

## 🔐 Security Warnings

### "Exposed API Key" Warning

**Note**: Firebase API keys are **safe** to expose in frontend code
- They identify your Firebase project
- Security is enforced by Firestore rules, not the API key
- Still, don't commit Razorpay or Gemini keys to public repos

### Razorpay Key Security

**Important**: 
- `key_id` (starts with rzp_): Safe in frontend
- `key_secret`: **NEVER** expose in frontend
- Use key_secret only in backend/serverless functions

## 🆘 Getting Help

If you can't resolve an issue:

1. **Check Documentation**:
   - README.md
   - SETUP_GUIDE.md
   - This file (TROUBLESHOOTING.md)

2. **Search Error Message**:
   - Google the exact error
   - Check Stack Overflow
   - Search GitHub issues

3. **Enable Debug Mode**:
```javascript
// Add console logs
console.log('Debug:', { 
  currentUser, 
  userData, 
  config 
});

// Use debugger
debugger; // Browser will pause here
```

4. **Check Firebase Status**:
   - https://status.firebase.google.com/

5. **Review Recent Changes**:
```bash
git diff
git log --oneline -10
```

## 📝 Creating Bug Reports

When reporting an issue, include:

1. **Error Message**: Exact text from console
2. **Steps to Reproduce**: What you did before error
3. **Expected vs Actual**: What should happen vs what happened
4. **Environment**: Browser, OS, Firebase project
5. **Code Snippet**: Relevant code (if possible)
6. **Screenshots**: Visual issues

## 🎯 Prevention Tips

1. **Always test locally** before deploying
2. **Use version control** (Git) for easy rollbacks
3. **Keep dependencies updated** regularly
4. **Monitor error logs** in production
5. **Test all payment flows** thoroughly
6. **Backup Firestore data** regularly
7. **Use TypeScript** for type safety
8. **Implement error boundaries** in React

---

**Remember**: Most issues are configuration-related. Double-check your setup files first!
