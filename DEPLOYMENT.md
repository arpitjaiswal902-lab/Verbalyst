# Verbalyst - Deployment Guide

## Pre-Deployment Checklist

### 1. Configuration Files
- [ ] All Firebase credentials updated in `src/config/firebase.ts`
- [ ] Admin email set in `src/config/constants.ts`
- [ ] Razorpay API keys configured
- [ ] Gemini API key configured
- [ ] Firestore security rules deployed

### 2. Testing
- [ ] Test Google authentication
- [ ] Test Phone OTP authentication
- [ ] Test all 15 industry flows
- [ ] Test payment integration (with test keys)
- [ ] Test admin panel access
- [ ] Test question CRUD operations
- [ ] Test interview completion and feedback
- [ ] Test history page
- [ ] Test responsive design on mobile/tablet

### 3. Production Settings
- [ ] Switch Razorpay from Test to Live mode
- [ ] Verify Gemini API quota limits
- [ ] Enable Firebase App Check
- [ ] Set up Firebase Analytics
- [ ] Configure error monitoring

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

Firebase Hosting is the recommended option as you're already using Firebase for backend services.

#### Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# When prompted, select:
# - Use an existing project (select your project)
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: Optional
# - Overwrite index.html: No
```

#### Deploy
```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Your app will be live at:
# https://your-project-id.web.app
# or
# https://your-project-id.firebaseapp.com
```

#### Custom Domain
```bash
# Add custom domain in Firebase Console
# Go to Hosting → Connect domain
# Follow the DNS configuration steps

# After DNS verification, your app will be available at:
# https://www.yourverbalyst.com
```

### Option 2: Vercel

Vercel offers excellent performance and automatic deployments from Git.

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set build command: npm run build
# - Set output directory: dist
# - Set install command: npm install
```

#### Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=your_email
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### Option 3: Netlify

Similar to Vercel, great for React applications.

#### Setup via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init

# Build settings:
# - Build command: npm run build
# - Publish directory: dist
```

#### Setup via Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Go to Netlify Dashboard
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Deploy settings

### Option 4: Self-Hosted (VPS/Cloud)

For complete control, deploy on your own server.

#### Requirements
- Node.js 18+ installed
- Nginx or Apache web server
- SSL certificate (Let's Encrypt recommended)
- Domain name

#### Deployment Steps
```bash
# On your server
cd /var/www

# Clone repository
git clone your-repo-url verbalyst
cd verbalyst

# Install dependencies
npm install

# Build
npm run build

# The dist folder contains your production files
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourverbalyst.com www.yourverbalyst.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourverbalyst.com www.yourverbalyst.com;
    
    ssl_certificate /etc/letsencrypt/live/yourverbalyst.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourverbalyst.com/privkey.pem;
    
    root /var/www/verbalyst/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment Steps

### 1. Firebase Configuration

#### Update Authorized Domains
1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add your production domain:
   - `yourverbalyst.com`
   - `www.yourverbalyst.com`

#### Configure OAuth Redirect URIs
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://yourverbalyst.com/__/auth/handler`
   - `https://www.yourverbalyst.com/__/auth/handler`

### 2. Razorpay Configuration

#### Update Webhook URLs
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourverbalyst.com/api/webhook/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Note: You'll need a backend endpoint for this

#### Test Live Payments
1. Switch to Live Mode in Razorpay Dashboard
2. Generate Live API keys
3. Update keys in your production config
4. Test with real payment methods

### 3. DNS Configuration

For custom domain:
```
Type    Name    Value                   TTL
A       @       your-server-ip          3600
A       www     your-server-ip          3600
CNAME   @       your-hosting-url        3600
```

### 4. SSL Certificate

#### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourverbalyst.com -d www.yourverbalyst.com

# Auto-renewal is configured automatically
# Verify with:
sudo certbot renew --dry-run
```

### 5. Monitoring Setup

#### Firebase Analytics
Already enabled if you followed setup. Check:
- Firebase Console → Analytics
- View user engagement, retention, and conversions

#### Performance Monitoring
```bash
# Install Firebase Performance SDK
npm install firebase/performance

# Initialize in your app
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

#### Error Tracking (Optional - Sentry)
```bash
npm install @sentry/react @sentry/vite-plugin

# Configure in src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Performance Optimization

### 1. Enable Compression
Most hosting platforms enable this by default. For self-hosted:

```nginx
# In nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json;
```

### 2. CDN Integration
Consider using a CDN for static assets:
- Cloudflare (free tier available)
- AWS CloudFront
- Google Cloud CDN

### 3. Cache Headers
Already configured in Vite build. Verify in browser DevTools.

## Security Checklist

- [ ] HTTPS enabled and enforced
- [ ] Firestore security rules deployed
- [ ] Firebase App Check enabled
- [ ] CORS properly configured
- [ ] Rate limiting on API endpoints
- [ ] Environment variables not exposed in client code
- [ ] Razorpay webhook signature verification (backend)
- [ ] XSS protection headers enabled
- [ ] CSRF protection implemented
- [ ] Content Security Policy configured

## Maintenance

### Regular Updates
```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Backup Strategy
1. **Firestore Backup**:
   - Enable automatic backups in Firebase Console
   - Or use `gcloud firestore export`

2. **Code Backup**:
   - Use Git version control
   - Push to remote repository regularly

### Monitoring Checklist
- [ ] Check Firebase Analytics weekly
- [ ] Monitor error rates
- [ ] Review payment success rates
- [ ] Check API quota usage (Gemini API)
- [ ] Monitor user growth and conversion rates

## Rollback Plan

If something goes wrong after deployment:

### Firebase Hosting
```bash
# List previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID DESTINATION_CHANNEL_ID
```

### Vercel
```bash
# Promote previous deployment
vercel rollback
```

### Self-Hosted
```bash
# Keep previous build
mv dist dist.backup
mv dist.new dist

# If issues, rollback
mv dist dist.failed
mv dist.backup dist
```

## Troubleshooting

### Common Issues

**Issue**: White screen after deployment
- Check console for errors
- Verify all environment variables are set
- Ensure build completed successfully

**Issue**: Authentication not working
- Check authorized domains in Firebase
- Verify OAuth redirect URIs
- Check CORS settings

**Issue**: Payment modal not opening
- Verify Razorpay script is loaded
- Check Razorpay Key ID is correct
- Ensure domain is authorized in Razorpay

**Issue**: Admin panel not accessible
- Verify logged-in email matches ADMIN_EMAIL
- Check Firestore security rules
- Clear browser cache

## Support

For deployment issues:
- Firebase: https://firebase.google.com/support
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support/

---

**Good luck with your deployment!** 🚀

Remember to test thoroughly before switching to production mode for payments.
