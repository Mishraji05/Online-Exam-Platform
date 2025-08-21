import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const Results = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await apiService.getResult(resultId);
      setResult(response.data.result);
    } catch (error) {
      console.error('Failed to fetch result:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (!result) {
    return (
      <div className="loading">
        Result not found.
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

  return (
    <div className="results-container">
      <div className="results-content">
        <div className="results-header">
          <h1 className="results-title">Exam Results</h1>
          <p className="results-subtitle">
            Completed on {new Date(result.completedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="score-card">
          <div className="score-display" style={{ color: getGradeColor(result.percentage) }}>
            {result.percentage}%
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: getGradeColor(result.percentage), marginBottom: '16px' }}>
            Grade: {getGradeLetter(result.percentage)}
          </div>

          <div className="score-details">
            <div className="score-item">
              <div className="score-label">Score</div>
              <div className="score-value">{result.score}/{result.totalQuestions}</div>
            </div>
            <div className="score-item">
              <div className="score-label">Correct Answers</div>
              <div className="score-value" style={{ color: '#10b981' }}>
                {result.questions.filter(q => q.isCorrect).length}
              </div>
            </div>
            <div className="score-item">
              <div className="score-label">Incorrect Answers</div>
              <div className="score-value" style={{ color: '#ef4444' }}>
                {result.questions.filter(q => !q.isCorrect).length}
              </div>
            </div>
            <div className="score-item">
              <div className="score-label">Time Spent</div>
              <div className="score-value">{formatTime(result.timeSpent)}</div>
            </div>
          </div>
        </div>

        <div className="questions-overview">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 className="overview-title">Question Overview</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-outline"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {result.questions.map((questionResult, index) => (
            <div 
              key={questionResult.questionId._id}
              className={`question-item ${questionResult.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="question-summary">
                <span style={{ fontWeight: '600' }}>
                  Question {index + 1}
                </span>
                <div className="question-status">
                  <div className={`status-icon ${questionResult.isCorrect ? 'correct' : 'incorrect'}`}>
                    {questionResult.isCorrect ? '✓' : '✗'}
                  </div>
                  <span style={{ color: questionResult.isCorrect ? '#10b981' : '#ef4444' }}>
                    {questionResult.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>

              {showDetails && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#1f2937'
                  }}>
                    {questionResult.questionId.question}
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Your Answer: </strong>
                    <span style={{ 
                      color: questionResult.isCorrect ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {String.fromCharCode(65 + questionResult.selectedAnswer)}. {' '}
                      {questionResult.questionId.options[questionResult.selectedAnswer]}
                    </span>
                  </div>
                  
                  {!questionResult.isCorrect && (
                    <div>
                      <strong>Correct Answer: </strong>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        {String.fromCharCode(65 + questionResult.questionId.correctAnswer)}. {' '}
                        {questionResult.questionId.options[questionResult.questionId.correctAnswer]}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          marginTop: '32px'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/exam')}
            className="btn btn-outline"
          >
            Take Another Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;