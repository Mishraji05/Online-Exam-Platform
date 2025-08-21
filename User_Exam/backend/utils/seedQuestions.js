const mongoose = require('mongoose');
require('dotenv').config();

// Define Question Schema directly here to avoid import issues
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['react', 'api', 'database', 'general'],
    required: true
  }
}, {
  timestamps: true
});

const sampleQuestions = [
  {
    question: "What is JSX in React?",
    options: [
      "A JavaScript extension that allows XML-like syntax",
      "A CSS framework for React",
      "A database for React applications",
      "A state management library"
    ],
    correctAnswer: 0,
    category: "react",
    difficulty: "easy"
  },
  {
    question: "Which hook is used to manage state in functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1,
    category: "react",
    difficulty: "easy"
  },
  {
    question: "What is the purpose of useEffect hook?",
    options: [
      "To manage component state",
      "To handle side effects in functional components",
      "To create context for components",
      "To optimize component performance"
    ],
    correctAnswer: 1,
    category: "react",
    difficulty: "medium"
  },
  {
    question: "What does REST stand for?",
    options: [
      "Representational State Transfer",
      "Remote State Transfer",
      "Relational State Transfer",
      "Responsive State Transfer"
    ],
    correctAnswer: 0,
    category: "api",
    difficulty: "easy"
  },
  {
    question: "Which HTTP method is used to retrieve data?",
    options: ["POST", "PUT", "DELETE", "GET"],
    correctAnswer: 3,
    category: "api",
    difficulty: "easy"
  },
  {
    question: "What is JWT?",
    options: [
      "Java Web Token",
      "JSON Web Token",
      "JavaScript Web Tool",
      "Java Web Tool"
    ],
    correctAnswer: 1,
    category: "api",
    difficulty: "medium"
  },
  {
    question: "What type of database is MongoDB?",
    options: ["Relational", "NoSQL Document", "Graph", "Key-Value"],
    correctAnswer: 1,
    category: "database",
    difficulty: "easy"
  },
  {
    question: "What is a collection in MongoDB?",
    options: [
      "A group of databases",
      "A group of documents",
      "A group of fields",
      "A group of indexes"
    ],
    correctAnswer: 1,
    category: "database",
    difficulty: "easy"
  },
  {
    question: "Which method is used to find documents in MongoDB?",
    options: ["search()", "find()", "get()", "select()"],
    correctAnswer: 1,
    category: "database",
    difficulty: "medium"
  },
  {
    question: "What is indexing in databases?",
    options: [
      "A way to sort data",
      "A technique to improve query performance",
      "A method to backup data",
      "A way to encrypt data"
    ],
    correctAnswer: 1,
    category: "database",
    difficulty: "medium"
  }
];

const seedQuestions = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create Question model
    const Question = mongoose.model('Question', questionSchema);

    console.log('Clearing existing questions...');
    await Question.deleteMany({});
    console.log('Existing questions cleared');

    console.log('Inserting sample questions...');
    const insertedQuestions = await Question.insertMany(sampleQuestions);
    console.log(`${insertedQuestions.length} sample questions inserted successfully`);

    console.log('Closing database connection...');
    mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();