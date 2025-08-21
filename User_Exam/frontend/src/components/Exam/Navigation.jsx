import React from 'react';

const Navigation = ({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmit, 
  answers,
  isSubmitting 
}) => {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasAnsweredCurrent = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  return (
    <div className="question-navigation">
      <div className="nav-buttons">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="btn btn-secondary"
        >
          ← Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={onNext}
            className="btn btn-primary"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn btn-success"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        )}
      </div>

      <div className="progress-info">
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          Progress: {Object.keys(answers).length}/{totalQuestions} questions answered
        </div>
        <div style={{
          width: '200px',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: `${(Object.keys(answers).length / totalQuestions) * 100}%`,
              height: '100%',
              backgroundColor: '#667eea',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Navigation;