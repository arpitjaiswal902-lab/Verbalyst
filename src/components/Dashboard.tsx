import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { INDUSTRIES, COLORS } from '../config/constants';
import { LogOut, Crown, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleIndustryClick = (industryId: string, industryName: string) => {
    navigate(`/track/${industryId}`, { state: { industryName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744]">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.royalBlue }}>
                Verbalyst
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {currentUser?.displayName || currentUser?.email || currentUser?.phoneNumber}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {userData?.isPremium && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.gold }}>
                  <Crown size={20} className="text-white" />
                  <span className="text-white font-semibold">Premium</span>
                </div>
              )}
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: COLORS.royalBlue, color: COLORS.royalBlue }}
              >
                <History size={20} />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                style={{ backgroundColor: COLORS.royalBlue }}
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Industry
          </h2>
          <p className="text-xl text-gray-300">
            Select from India's most demanding sectors to begin your interview preparation
          </p>
          {!userData?.isPremium && (
            <p className="text-lg mt-2" style={{ color: COLORS.gold }}>
              {userData?.questionsAnswered || 0}/2 free questions used
            </p>
          )}
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry.id}
              onClick={() => handleIndustryClick(industry.id, industry.name)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {industry.icon}
              </div>
              <h3 className="text-lg font-bold text-center" style={{ color: COLORS.royalBlue }}>
                {industry.name}
              </h3>
            </button>
          ))}
        </div>

        {/* Premium CTA */}
        {!userData?.isPremium && (
          <div className="mt-12 bg-gradient-to-r from-[#D4AF37] to-[#F4E4A6] rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <Crown size={48} className="mx-auto mb-4" style={{ color: COLORS.royalBlue }} />
              <h3 className="text-3xl font-bold mb-2" style={{ color: COLORS.royalBlue }}>
                Unlock Full Access
              </h3>
              <p className="text-lg mb-6" style={{ color: COLORS.royalBlue }}>
                Get unlimited access to all industries and tracks for just ₹299
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-left mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span style={{ color: COLORS.royalBlue }}>Unlimited Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span style={{ color: COLORS.royalBlue }}>AI Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span style={{ color: COLORS.royalBlue }}>Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
