import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { EXAM_CONFIG } from '../../utils/constants';
import Timer from './Timer';
import Question from './Question';
import Navigation from './Navigation';

const ExamInterface = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(EXAM_CONFIG.TIME_LIMIT);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure we have a user and token before fetching questions
    if (user) {
      fetchExamQuestions();
    } else {
      // If no user, redirect to login
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchExamQuestions = async () => {
    try {
      // Ensure the auth token is set in the API service
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        navigate('/login');
        return;
      }
      
      apiService.setAuthToken(token);
      
      const response = await apiService.getExamQuestions();
      setQuestions(response.data.questions);
      setTimeLimit(response.data.timeLimit);
      setExamStartTime(Date.now());
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        // Other error, redirect to dashboard
        alert('Failed to load exam questions. Please try again.');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        questionId,
        selectedAnswer: answerIndex
      }
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateTimeSpent = () => {
    return Math.floor((Date.now() - examStartTime) / 1000);
  };

  const handleSubmitExam = async () => {
    if (submitting) return;

    const confirmSubmit = window.confirm(
      'Are you sure you want to submit your exam? This action cannot be undone.'
    );
    
    if (!confirmSubmit) return;

    setSubmitting(true);

    try {
      const examAnswers = Object.values(answers);
      const timeSpent = calculateTimeSpent();

      const response = await apiService.submitExam({
        answers: examAnswers,
        timeSpent
      });

      // Navigate to results page
      navigate(`/results/${response.data.result.resultId}`);
    } catch (error) {
      console.error('Failed to submit exam:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit when time runs out
    handleSubmitExam();
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to logout? Your exam progress will be lost.'
    );
    
    if (confirmLogout) {
      logout();
    }
  };

  if (loading) {
    return <div className="loading">Loading exam questions...</div>;
  }

  if (!questions.length) {
    return (
      <div className="loading">
        No questions available. 
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
          style={{ marginLeft: '16px' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="exam-container">
      <div className="exam-header">
        <div className="exam-nav">
          <div className="exam-progress">
            <span className="progress-text">
              {user?.name} • Reg: {user?.registrationNumber}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Timer 
              duration={timeLimit}
              onTimeUp={handleTimeUp}
              isActive={!submitting}
            />
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="exam-content">
        <Question
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={currentAnswer?.selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />

        <Navigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmitExam}
          answers={answers}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
};

export default ExamInterface;