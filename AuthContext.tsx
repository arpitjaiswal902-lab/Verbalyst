import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  setupRecaptcha: (phoneNumber: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
  updateUserPremiumStatus: () => Promise<void>;
  incrementQuestionsAnswered: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as User);
      } else {
        // Create new user document
        const newUser: User = {
          uid,
          email: currentUser?.email || null,
          phoneNumber: currentUser?.phoneNumber || null,
          displayName: currentUser?.displayName || null,
          isPremium: false,
          questionsAnswered: 0,
          createdAt: new Date()
        };
        await setDoc(doc(db, 'users', uid), newUser);
        setUserData(newUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await loadUserData(result.user.uid);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const setupRecaptcha = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      // @ts-ignore
      if (!window.recaptchaVerifier) {
        // @ts-ignore
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        });
      }
      // @ts-ignore
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Error setting up phone auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserPremiumStatus = async () => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        isPremium: true
      });
      await loadUserData(currentUser.uid);
    } catch (error) {
      console.error('Error updating premium status:', error);
      throw error;
    }
  };

  const incrementQuestionsAnswered = async () => {
    if (!currentUser || !userData) return;
    try {
      const newCount = userData.questionsAnswered + 1;
      await updateDoc(doc(db, 'users', currentUser.uid), {
        questionsAnswered: newCount
      });
      setUserData({ ...userData, questionsAnswered: newCount });
    } catch (error) {
      console.error('Error incrementing questions answered:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    setupRecaptcha,
    logout,
    updateUserPremiumStatus,
    incrementQuestionsAnswered
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
