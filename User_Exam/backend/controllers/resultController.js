const Result = require('../models/Result');
const Question = require('../models/Question');

exports.submitExam = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const userId = req.user._id;

    // Get all questions with their correct answers
    const questionIds = answers.map(answer => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let score = 0;
    const detailedAnswers = [];

    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) score++;

        detailedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        });
      }
    });

    const percentage = (score / answers.length) * 100;

    const result = new Result({
      userId,
      questions: detailedAnswers,
      score,
      totalQuestions: answers.length,
      percentage: Math.round(percentage),
      timeSpent
    });

    await result.save();

    res.json({
      message: 'Exam submitted successfully',
      result: {
        score,
        totalQuestions: answers.length,
        percentage: Math.round(percentage),
        timeSpent,
        resultId: result._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.user._id;

    const result = await Result.findOne({ _id: resultId, userId })
      .populate({
        path: 'questions.questionId',
        select: 'question options correctAnswer'
      });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const results = await Result.find({ userId })
      .sort({ completedAt: -1 })
      .select('-questions');

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};