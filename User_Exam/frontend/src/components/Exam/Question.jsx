import React from 'react';

const Question = ({ question, questionNumber, totalQuestions, selectedAnswer, onAnswerSelect }) => {
  const handleAnswerChange = (optionIndex) => {
    onAnswerSelect(question._id, optionIndex);
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-number">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="question-text">
          {question.question}
        </div>
      </div>

      <ul className="options-list">
        {question.options.map((option, index) => (
          <li key={index} className="option-item">
            <label 
              className={`option-label ${selectedAnswer === index ? 'selected' : ''}`}
              htmlFor={`option-${question._id}-${index}`}
            >
              <input
                type="radio"
                id={`option-${question._id}-${index}`}
                name={`question-${question._id}`}
                value={index}
                checked={selectedAnswer === index}
                onChange={() => handleAnswerChange(index)}
                className="option-input"
              />
              <span className="option-text">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;