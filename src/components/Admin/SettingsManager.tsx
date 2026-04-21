import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLORS } from '../../config/constants';
import { Save, Key } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [productPrice, setProductPrice] = useState(299);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'razorpay'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setRazorpayKeyId(data.razorpayKeyId || '');
        setProductPrice(data.productPrice || 299);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await setDoc(doc(db, 'settings', 'razorpay'), {
        razorpayKeyId,
        productPrice
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-2xl font-bold mb-6" style={{ color: COLORS.royalBlue }}>
        Payment Settings
      </h3>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Key size={18} />
            Razorpay Key ID
          </label>
          <input
            type="text"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            placeholder="rzp_live_xxxxxxxxxxxxx"
          />
          <p className="text-sm text-gray-500 mt-1">
            Get this from your Razorpay dashboard
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Premium Product Price (₹)
          </label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            min="1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Current price: ₹{productPrice}
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
          style={{ backgroundColor: COLORS.royalBlue }}
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>

        {saved && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-bold text-yellow-800 mb-2">⚠️ Important Security Note</h4>
        <p className="text-sm text-yellow-700">
          Never share your Razorpay Key Secret publicly. The Key Secret should only be used in secure backend environments.
          Only the Key ID is needed for frontend checkout integration.
        </p>
      </div>
    </div>
  );
};
