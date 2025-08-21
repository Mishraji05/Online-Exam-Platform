const Question = require("../models/Question");

exports.getExamQuestions = async (req, res) => {
  try {
    console.log("Fetching exam questions...");
    console.log("User requesting questions:", req.user);

    // First check if there are any questions in the database
    const totalQuestions = await Question.countDocuments();
    console.log("Total questions in database:", totalQuestions);

    if (totalQuestions === 0) {
      console.log("No questions found in database");
      return res
        .status(404)
        .json({ message: "No questions found in database" });
    }

    // Fix: Use only inclusion fields (1) - don't mix with exclusion (0)
    console.log("Using find query with proper projection...");
    let questions = await Question.find(
      {},
      {
        question: 1,
        options: 1,
        category: 1,
        difficulty: 1,
        _id: 1,
        // Note: correctAnswer is automatically excluded when not specified
      }
    ).limit(10);

    // Shuffle the questions to randomize them
    questions = questions.sort(() => Math.random() - 0.5);

    console.log("Questions fetched successfully:", questions.length);

    if (!questions || questions.length === 0) {
      console.log("No questions returned from query");
      return res.status(404).json({ message: "No questions found" });
    }

    res.json({
      questions,
      totalQuestions: questions.length,
      timeLimit: 30 * 60, // 30 minutes in seconds
    });
  } catch (error) {
    console.error("Error in getExamQuestions:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
