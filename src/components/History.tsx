import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Interview } from '../types';
import { COLORS } from '../config/constants';
import { ArrowLeft, Calendar, Award, Loader } from 'lucide-react';

export const History: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = async () => {
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'interviews'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const loadedInterviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Interview[];
      
      setInterviews(loadedInterviews);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return '#999999';
    if (score >= 8) return '#10B981';
    if (score >= 6) return COLORS.gold;
    return '#EF4444';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744] flex items-center justify-center">
        <Loader className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-8" style={{ color: COLORS.royalBlue }}>
            Your Interview History
          </h1>

          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <Award size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">
                No interviews completed yet. Start practicing now!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-6 px-6 py-3 rounded-lg font-semibold text-white"
                style={{ backgroundColor: COLORS.royalBlue }}
              >
                Start Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.royalBlue }}>
                        {interview.industryName}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(interview.timestamp)}
                        </div>
                        <div className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                          style={{ backgroundColor: COLORS.royalBlue }}>
                          {interview.track.toUpperCase()}
                        </div>
                        <div>
                          {interview.answers.length} questions answered
                        </div>
                      </div>
                    </div>
                    
                    {interview.score && (
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(interview.score) }}>
                            {interview.score}/10
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {interview.tips && interview.tips.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-semibold text-sm mb-2" style={{ color: COLORS.royalBlue }}>
                        Key Improvement Tips:
                      </p>
                      <ul className="space-y-1">
                        {interview.tips.slice(0, 3).map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span style={{ color: COLORS.gold }}>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
