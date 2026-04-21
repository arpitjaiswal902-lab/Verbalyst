import React, { useState } from 'react';
import { X, Crown, Check, Loader } from 'lucide-react';
import { COLORS, PREMIUM_PRICE, RAZORPAY_CONFIG } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface PaymentModalProps {
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { currentUser, updateUserPremiumStatus } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Get Razorpay key from Firestore settings
      let razorpayKey = RAZORPAY_CONFIG.keyId;
      let price = PREMIUM_PRICE;
      
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'razorpay'));
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data();
          razorpayKey = settings.razorpayKeyId || razorpayKey;
          price = settings.productPrice || price;
        }
      } catch (error) {
        console.log('Using default Razorpay settings');
      }

      const options = {
        key: razorpayKey,
        amount: price * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Verbalyst',
        description: 'Premium Membership',
        image: '/logo.png',
        handler: async function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Update user premium status
          await updateUserPremiumStatus();
          
          // Close modal and reload
          alert('Payment successful! You now have premium access.');
          onClose();
          window.location.reload();
        },
        prefill: {
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          contact: currentUser?.phoneNumber || ''
        },
        theme: {
          color: COLORS.royalBlue
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.gold }}>
            <Crown size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.royalBlue }}>
            Unlock Full Access
          </h2>
          <p className="text-gray-600">
            You've reached your free question limit
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold mb-2" style={{ color: COLORS.royalBlue }}>
              ₹299
            </div>
            <p className="text-gray-600">One-time payment</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.gold }}>
                <Check size={16} className="text-white" />
              </div>
              <span className="text-gray-700">Unlimited access to all 15 industries</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.gold }}>
                <Check size={16} className="text-white" />
              </div>
              <span className="text-gray-700">Both Fresher & Senior tracks</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.gold }}>
                <Check size={16} className="text-white" />
              </div>
              <span className="text-gray-700">AI-powered feedback on every interview</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.gold }}>
                <Check size={16} className="text-white" />
              </div>
              <span className="text-gray-700">Complete interview history tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.gold }}>
                <Check size={16} className="text-white" />
              </div>
              <span className="text-gray-700">Lifetime access - no recurring fees</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: COLORS.royalBlue }}
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              Upgrade to Premium
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};
