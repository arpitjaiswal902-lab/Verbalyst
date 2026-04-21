import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLORS, PREMIUM_PRICE } from '../../config/constants';
import { Users, Crown, DollarSign, TrendingUp, Loader } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setTotalUsers(usersSnapshot.size);

      // Get premium users
      const premiumQuery = query(collection(db, 'users'), where('isPremium', '==', true));
      const premiumSnapshot = await getDocs(premiumQuery);
      const premiumCount = premiumSnapshot.size;
      setPremiumUsers(premiumCount);

      // Calculate revenue (premium users * price)
      const settingsDoc = await getDocs(collection(db, 'settings'));
      let price = PREMIUM_PRICE;
      settingsDoc.forEach(doc => {
        if (doc.id === 'razorpay' && doc.data().productPrice) {
          price = doc.data().productPrice;
        }
      });
      setTotalRevenue(premiumCount * price);

      // Get total interviews
      const interviewsSnapshot = await getDocs(collection(db, 'interviews'));
      setTotalInterviews(interviewsSnapshot.size);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin" style={{ color: COLORS.royalBlue }} size={48} />
      </div>
    );
  }

  const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0';

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6" style={{ color: COLORS.royalBlue }}>
        Platform Analytics
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalUsers}</div>
          <div className="text-blue-100">Total Users</div>
        </div>

        {/* Premium Users */}
        <div className="rounded-xl p-6 text-white" style={{ background: `linear-gradient(to bottom right, ${COLORS.gold}, #B8941F)` }}>
          <div className="flex items-center justify-between mb-4">
            <Crown size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">{premiumUsers}</div>
          <div className="opacity-90">Premium Users</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-green-100">Total Revenue</div>
        </div>

        {/* Total Interviews */}
        <div className="rounded-xl p-6 text-white" style={{ background: `linear-gradient(to bottom right, ${COLORS.royalBlue}, #001744)` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">💬</div>
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalInterviews}</div>
          <div className="opacity-90">Total Interviews</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.royalBlue }}>
            Conversion Rate
          </h4>
          <div className="text-4xl font-bold mb-2" style={{ color: COLORS.gold }}>
            {conversionRate}%
          </div>
          <p className="text-gray-600">
            {premiumUsers} out of {totalUsers} users upgraded to premium
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.royalBlue }}>
            Average Revenue Per User
          </h4>
          <div className="text-4xl font-bold mb-2" style={{ color: COLORS.gold }}>
            ₹{totalUsers > 0 ? Math.round(totalRevenue / totalUsers) : 0}
          </div>
          <p className="text-gray-600">
            Total revenue divided by total users
          </p>
        </div>
      </div>
    </div>
  );
};
