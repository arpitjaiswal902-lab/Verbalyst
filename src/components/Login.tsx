import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../config/constants';
import { Phone, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInWithGoogle, setupRecaptcha } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      const result = await setupRecaptcha(formattedPhone);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      await confirmationResult.confirm(otp);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002366] to-[#001744] p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2" style={{ color: COLORS.gold }}>
            Verbalyst
          </h1>
          <p className="text-white text-lg opacity-90">
            Premium Interview Preparation Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.royalBlue }}>
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-[#002366] text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 mb-4 disabled:opacity-50"
          >
            <Mail size={20} />
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Phone Sign In */}
          {!confirmationResult ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || phoneNumber.length < 10}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50"
                    style={{ backgroundColor: COLORS.royalBlue }}
                  >
                    <Phone size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: COLORS.royalBlue }}
              >
                Verify & Continue
              </button>
              <button
                onClick={() => {
                  setConfirmationResult(null);
                  setOtp('');
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                Change Phone Number
              </button>
            </div>
          )}

          <div id="recaptcha-container"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6 opacity-75">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
