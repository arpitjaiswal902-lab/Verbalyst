import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, ADMIN_EMAIL } from '../../config/constants';
import { ArrowLeft, Database, Settings, BarChart3 } from 'lucide-react';
import { QuestionManager } from './QuestionManager';
import { SettingsManager } from './SettingsManager';
import { Analytics } from './Analytics';

export const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'questions' | 'settings' | 'analytics'>('questions');

  // Check if user is admin
  if (currentUser?.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.royalBlue }}>
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: COLORS.royalBlue }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b" style={{ backgroundColor: COLORS.royalBlue }}>
            <h1 className="text-3xl font-bold text-white">
              Verbalyst Command Center
            </h1>
            <p className="text-white/80 mt-1">
              Manage your platform settings and content
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'questions'
                  ? 'border-b-4 text-[#002366]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'questions' ? { borderColor: COLORS.royalBlue } : {}}
            >
              <Database size={20} />
              Questions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'border-b-4 text-[#002366]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'settings' ? { borderColor: COLORS.royalBlue } : {}}
            >
              <Settings size={20} />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'border-b-4 text-[#002366]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'analytics' ? { borderColor: COLORS.royalBlue } : {}}
            >
              <BarChart3 size={20} />
              Analytics
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'questions' && <QuestionManager />}
            {activeTab === 'settings' && <SettingsManager />}
            {activeTab === 'analytics' && <Analytics />}
          </div>
        </div>
      </div>
    </div>
  );
};
