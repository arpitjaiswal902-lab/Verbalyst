import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Question, Answer, Interview as InterviewType } from '../types';
import { COLORS, FREE_QUESTIONS_LIMIT, GEMINI_API_KEY } from '../config/constants';
import { ArrowLeft, Send, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PaymentModal } from './PaymentModal';

export const Interview: React.FC = () => {
  const { industryId, track } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, currentUser, incrementQuestionsAnswered } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const industryName = location.state?.industryName || 'Industry';

  useEffect(() => {
    loadQuestions();
  }, [industryId, track]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'questions'),
        where('industry', '==', industryId),
        where('track', '==', track)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Create default questions if none exist
        await createDefaultQuestions();
        await loadQuestions();
        return;
      }

      const loadedQuestions = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Question))
        .sort((a, b) => a.order - b.order);
      
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultQuestions = async () => {
    const defaultQuestions = [
      {
        industry: industryId,
        track,
        type: 'introduction',
        question: 'Tell me about yourself and why you are interested in this role.',
        order: 1
      },
      {
        industry: industryId,
        track,
        type: 'technical',
        question: `What are the key technical skills required in the ${industryName} industry?`,
        order: 2
      },
      {
        industry: industryId,
        track,
        type: 'technical',
        question: `Describe a challenging technical problem you've solved in ${industryName}.`,
        order: 3
      },
      {
        industry: industryId,
        track,
        type: 'behavioral',
        question: 'Describe a time when you had to work under pressure. How did you handle it?',
        order: 4
      },
      {
        industry: industryId,
        track,
        type: 'behavioral',
        question: 'Tell me about a time you disagreed with a team member. How did you resolve it?',
        order: 5
      },
      {
        industry: industryId,
        track,
        type: 'closing',
        question: 'Do you have any questions for us?',
        order: 6
      }
    ];

    for (const q of defaultQuestions) {
      await addDoc(collection(db, 'questions'), q);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    // Check paywall before allowing answer
    if (!userData?.isPremium && (userData?.questionsAnswered || 0) >= FREE_QUESTIONS_LIMIT) {
      setShowPaywall(true);
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: currentAnswer,
      type: currentQuestion.type
    };

    setAnswers([...answers, newAnswer]);
    setCurrentAnswer('');
    
    // Increment questions answered count
    await incrementQuestionsAnswered();

    // Move to next question or complete interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      // Check if next question triggers paywall
      if (!userData?.isPremium && (userData?.questionsAnswered || 0) + 1 >= FREE_QUESTIONS_LIMIT) {
        setShowPaywall(true);
      }
    } else {
      // Interview complete - analyze with AI
      await analyzeInterview([...answers, newAnswer]);
    }
  };

  const analyzeInterview = async (allAnswers: Answer[]) => {
    setAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are an expert interview coach. Analyze the following interview responses and provide:
1. An overall score from 1-10
2. Three specific, actionable tips for improvement

Interview for: ${industryName} (${track} level)

Responses:
${allAnswers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Provide your feedback in the following JSON format:
{
  "score": <number 1-10>,
  "tips": ["tip1", "tip2", "tip3"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      let feedback;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          feedback = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        // Fallback if JSON parsing fails
        feedback = {
          score: 7,
          tips: [
            'Provide more specific examples from your experience',
            'Structure your answers using the STAR method',
            'Show more enthusiasm and passion for the role'
          ]
        };
      }

      // Save interview to Firestore
      const interview: Omit<InterviewType, 'id'> = {
        userId: currentUser!.uid,
        industry: industryId!,
        industryName,
        track: track as 'fresher' | 'senior',
        answers: allAnswers,
        score: feedback.score,
        feedback: text,
        tips: feedback.tips,
        timestamp: new Date(),
        completed: true
      };

      await addDoc(collection(db, 'interviews'), interview);
      
      // Navigate to feedback page
      navigate('/feedback', { state: { score: feedback.score, tips: feedback.tips, industryName } });
    } catch (error) {
      console.error('Error analyzing interview:', error);
      // Navigate to feedback with default values
      navigate('/feedback', { 
        state: { 
          score: 7, 
          tips: [
            'Provide more specific examples',
            'Be concise and structured',
            'Show enthusiasm for the role'
          ], 
          industryName 
        } 
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744] flex items-center justify-center">
        <Loader className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" style={{ color: COLORS.gold }} size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Performance...</h2>
          <p className="text-gray-300">Our AI is reviewing your answers</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#001744]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/track/${industryId}`, { state: { industryName } })}
          className="flex items-center gap-2 text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          Back to Track Selection
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span>Progress</span>
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: COLORS.gold,
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="mb-4">
            <span className="px-4 py-1 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: COLORS.royalBlue }}>
              {currentQuestion.type.toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.royalBlue }}>
            {currentQuestion.question}
          </h2>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={8}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#002366] resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {currentAnswer.length} characters
            </p>
            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: COLORS.royalBlue }}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Answered Questions */}
        {answers.length > 0 && (
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Your Previous Answers</h3>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-2">{answer.question}</p>
                  <p className="text-white">{answer.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaywall && <PaymentModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
};
