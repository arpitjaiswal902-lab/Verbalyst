import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../config/constants';
import { GraduationCap, Briefcase, ArrowLeft } from 'lucide-react';

export const TrackSelection: React.FC = () => {
  const { industryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const industryName = location.state?.industryName || 'Industry';

  const handleTrackSelect = (track: 'fresher' | 'senior') => {
    navigate(`/interview/${industryId}/${track}`, { state: { industryName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {industryName}
          </h1>
          <p className="text-xl text-gray-300">
            Select your experience level
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Fresher Track */}
          <button
            onClick={() => handleTrackSelect('fresher')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-[#D4AF37]/50 transform hover:-translate-y-2 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: COLORS.royalBlue }}>
                <GraduationCap size={48} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4" style={{ color: COLORS.royalBlue }}>
                Fresher
              </h3>
              <p className="text-gray-600 mb-6">
                Perfect for entry-level candidates and recent graduates
              </p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.gold }}>•</span>
                  <span>Basic technical concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.gold }}>•</span>
                  <span>Fundamental behavioral questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.gold }}>•</span>
                  <span>Career-starting scenarios</span>
                </li>
              </ul>
            </div>
          </button>

          {/* Senior Track */}
          <button
            onClick={() => handleTrackSelect('senior')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-[#D4AF37]/50 transform hover:-translate-y-2 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: COLORS.gold }}>
                <Briefcase size={48} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4" style={{ color: COLORS.royalBlue }}>
                Senior
              </h3>
              <p className="text-gray-600 mb-6">
                Designed for experienced professionals and leaders
              </p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.gold }}>•</span>
                  <span>Advanced technical challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.gold }}>•</span>
                  <span>Leadership & strategy questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.gold }}>•</span>
                  <span>Complex problem-solving scenarios</span>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
