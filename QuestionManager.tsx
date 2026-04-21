import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Question } from '../../types';
import { INDUSTRIES, COLORS, QUESTION_TYPES } from '../../config/constants';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

export const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<'fresher' | 'senior'>('fresher');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'introduction' as typeof QUESTION_TYPES[number],
    order: 1
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'questions'));
      const loadedQuestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Question[];
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedIndustry || !newQuestion.question.trim()) {
      alert('Please select an industry and enter a question');
      return;
    }

    try {
      await addDoc(collection(db, 'questions'), {
        industry: selectedIndustry,
        track: selectedTrack,
        type: newQuestion.type,
        question: newQuestion.question,
        order: newQuestion.order
      });
      
      setNewQuestion({ question: '', type: 'introduction', order: 1 });
      await loadQuestions();
      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteDoc(doc(db, 'questions', id));
      await loadQuestions();
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const handleUpdateQuestion = async (id: string, updatedData: Partial<Question>) => {
    try {
      await updateDoc(doc(db, 'questions', id), updatedData);
      await loadQuestions();
      setEditingId(null);
      alert('Question updated successfully!');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question');
    }
  };

  const filteredQuestions = questions.filter(q => 
    (!selectedIndustry || q.industry === selectedIndustry) &&
    q.track === selectedTrack
  );

  return (
    <div className="space-y-6">
      {/* Add Question Form */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.royalBlue }}>
          Add New Question
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="">Select Industry</option>
              {INDUSTRIES.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Track
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value as 'fresher' | 'senior')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="fresher">Fresher</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as typeof QUESTION_TYPES[number] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              {QUESTION_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <input
              type="number"
              value={newQuestion.order}
              onChange={(e) => setNewQuestion({ ...newQuestion, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
              min="1"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            placeholder="Enter your question here..."
          />
        </div>
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
          style={{ backgroundColor: COLORS.royalBlue }}
        >
          <Plus size={20} />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.royalBlue }}>
          Existing Questions ({filteredQuestions.length})
        </h3>
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No questions found. Add some questions to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.sort((a, b) => a.order - b.order).map((q) => (
              <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
                {editingId === q.id ? (
                  <div className="space-y-3">
                    <textarea
                      defaultValue={q.question}
                      id={`edit-${q.id}`}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newText = (document.getElementById(`edit-${q.id}`) as HTMLTextAreaElement).value;
                          handleUpdateQuestion(q.id, { question: newText });
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: COLORS.royalBlue }}
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-300 text-gray-700"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: COLORS.royalBlue }}>
                          {q.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: COLORS.gold, color: 'white' }}>
                          Order: {q.order}
                        </span>
                      </div>
                      <p className="text-gray-700">{q.question}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(q.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
