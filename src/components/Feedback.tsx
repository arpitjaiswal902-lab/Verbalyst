import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../config/constants';
import { Trophy, Home, TrendingUp } from 'lucide-react';

export const Feedback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, tips, industryName } = location.state || { score: 0, tips: [], industryName: '' };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10B981'; // Green
    if (score >= 6) return COLORS.gold; // Gold
    return '#EF4444'; // Red
  };

  const getScoreMessage = (score: number) => {
    if (score >= 8) return 'Excellent Performance!';
    if (score >= 6) return 'Good Job!';
    if (score >= 4) return 'Room for Improvement';
    return 'Keep Practicing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <Trophy size={64} className="mx-auto mb-4" style={{ color: getScoreColor(score) }} />
            <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.royalBlue }}>
              {getScoreMessage(score)}
            </h1>
            <p className="text-gray-600 text-lg">{industryName}</p>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 mb-4"
              style={{ borderColor: getScoreColor(score) }}>
              <span className="text-5xl font-bold" style={{ color: getScoreColor(score) }}>
                {score}
              </span>
              <span className="text-2xl text-gray-500">/10</span>
            </div>
          </div>

          {/* Tips Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={24} style={{ color: COLORS.royalBlue }} />
              <h2 className="text-2xl font-bold" style={{ color: COLORS.royalBlue }}>
                Professional Tips for Improvement
              </h2>
            </div>
            <div className="space-y-4">
              {tips.map((tip: string, index: number) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: COLORS.gold }}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.royalBlue }}
          >
            <Home size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex-1 px-6 py-4 rounded-xl font-semibold border-2 transition-all hover:bg-white"
            style={{ borderColor: COLORS.gold, color: COLORS.royalBlue }}
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};
