export interface User {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  isPremium: boolean;
  questionsAnswered: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  industry: string;
  track: 'fresher' | 'senior';
  type: 'introduction' | 'technical' | 'behavioral' | 'closing';
  question: string;
  order: number;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  type: string;
}

export interface Interview {
  id: string;
  userId: string;
  industry: string;
  industryName: string;
  track: 'fresher' | 'senior';
  answers: Answer[];
  score: number | null;
  feedback: string | null;
  tips: string[];
  timestamp: Date;
  completed: boolean;
}

export interface Settings {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  productPrice: number;
}

export interface Analytics {
  totalUsers: number;
  premiumUsers: number;
  totalRevenue: number;
}
