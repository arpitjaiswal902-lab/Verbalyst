export const INDUSTRIES = [
  { id: 'bfsi', name: 'Banking & Finance (BFSI)', icon: '🏦' },
  { id: 'bpo', name: 'BPO/ITES', icon: '📞' },
  { id: 'it-services', name: 'IT Services/SaaS', icon: '💻' },
  { id: 'ai-ml', name: 'AI & ML', icon: '🤖' },
  { id: 'healthcare', name: 'Healthcare/Pharma', icon: '🏥' },
  { id: 'ecommerce', name: 'E-commerce/Logistics', icon: '📦' },
  { id: 'manufacturing', name: 'Manufacturing/EV', icon: '🏭' },
  { id: 'renewable-energy', name: 'Renewable Energy', icon: '⚡' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: '📱' },
  { id: 'travel', name: 'Travel/Hospitality', icon: '✈️' },
  { id: 'edtech', name: 'EdTech', icon: '📚' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏢' },
  { id: 'fmcg', name: 'FMCG/Retail', icon: '🛒' },
  { id: 'mental-health', name: 'Mental Health', icon: '🧠' }
];

export const QUESTION_TYPES = [
  'introduction',
  'technical',
  'behavioral',
  'closing'
] as const;

export const TRACKS = ['fresher', 'senior'] as const;

export const COLORS = {
  royalBlue: '#002366',
  gold: '#D4AF37',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#333333'
};

export const FREE_QUESTIONS_LIMIT = 2;
export const PREMIUM_PRICE = 299;

export const ADMIN_EMAIL = 'YOUR_ADMIN_EMAIL@example.com'; // Replace with actual admin email

export const RAZORPAY_CONFIG = {
  keyId: 'YOUR_RAZORPAY_KEY_ID', // Replace with actual Razorpay Key ID
  keySecret: 'YOUR_RAZORPAY_KEY_SECRET' // This should be stored in backend
};

export const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with actual Gemini API Key
