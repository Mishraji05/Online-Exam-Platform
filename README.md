# Online-Exam-Platform
A comprehensive full-stack web application for conducting online examinations with secure authentication, real-time timer, and detailed result analysis.
🌟 Features
Student Features

✅ Secure Authentication - JWT-based registration and login
✅ Interactive Exam Interface - Clean, responsive design
✅ Real-time Timer - 30-minute countdown with auto-submit
✅ Question Navigation - Previous/Next buttons with progress tracking
✅ Instant Results - Detailed score breakdown with correct answers
✅ Exam History - View past exam attempts and performance
✅ Mobile Responsive - Works seamlessly on all devices

Technical Features

✅ JWT Authentication - Secure token-based authentication
✅ RESTful APIs - Well-structured backend architecture
✅ MongoDB Integration - NoSQL database with Mongoose ODM
✅ React Hooks - Modern React with functional components
✅ Responsive UI - Mobile-first design approach
✅ Error Handling - Comprehensive error management
✅ Input Validation - Server-side and client-side validation

🛠 Technology Stack
Frontend

React.js (v18+) - UI framework
React Router - Client-side routing
Axios - HTTP client
CSS3 - Styling with modern features

Backend

Node.js - Runtime environment
Express.js - Web application framework
MongoDB - NoSQL database
Mongoose - MongoDB object modeling
JWT - JSON Web Tokens for authentication
bcrypt - Password hashing

Development Tools

Nodemon - Auto-restart development server
CORS - Cross-origin resource sharing
dotenv - Environment variable management

🚀 Quick Start
Prerequisites

Node.js (v16 or higher)
npm or yarn
MongoDB Atlas account (free tier available)

Installation

Clone the repository

bashgit clone <repository-url>
cd exam-platform

Backend Setup

bashcd backend
npm install

Create backend environment file (.env)

envPORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-platform
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NODE_ENV=development

Seed the database

bashnpm run seed

Start backend server

bashnpm run dev

Frontend Setup (in new terminal)

bashcd frontend
npm install

Create frontend environment file (.env)

envREACT_APP_API_URL=http://localhost:5000/api

Start frontend application

bashnpm start
Access the Application

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api

📚 API Documentation
Authentication Endpoints
Register User
httpPOST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "registrationNumber": "REG2025001"
}
Login User
httpPOST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
Get User Profile
httpGET /api/auth/profile
Authorization: Bearer <jwt-token>
Exam Endpoints
Get Random Questions
httpGET /api/exam/questions
Authorization: Bearer <jwt-token>
Results Endpoints
Submit Exam
httpPOST /api/results/submit
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "question-id",
      "selectedAnswer": 0
    }
  ],
  "timeSpent": 1200
}
Get User Results
httpGET /api/results
Authorization: Bearer <jwt-token>
Get Specific Result
httpGET /api/results/:resultId
Authorization: Bearer <jwt-token>


📁 Project Structure

exam-platform/
|
├── README.md
|
├── backend/
|   |
│   ├── package.json
|   |
│   ├── server.js
|   |
│   ├── .env
|   |
│   ├── models/
|   |   |
│   │   ├── User.js
|   |   |
│   │   ├── Question.js
|   |   |
│   │   └── Result.js
|   |
│   ├── routes/
|   |   |
│   │   ├── auth.js
|   |   |
│   │   ├── exam.js
|   |   |
│   │   └── results.js
|   |
│   ├── controllers/
|   |   |
│   │   ├── authController.js
|   |   |
│   │   ├── examController.js
|   |   |
│   │   └── resultController.js
|   |
│   ├── middleware/
|   |   |
│   │   └── auth.js
|   |
│   ├── config/
|   |   |
│   │   └── database.js
|   |
│   └── utils/
|       |
│       └── seedQuestions.js
|
├── frontend/
|   |
│   ├── package.json
|   |
│   ├── .env
|   |
│   ├── public/
|   |   |
│   │   └── index.html
|   |
│   └── src/
|       |
│       ├── components/
|       |   |
│       │   ├── Auth/
|       |   |
│       │   ├── Dashboard/
|       |   |
│       │   ├── Exam/
|       |   |
│       │   └── Results/
|       |
│       ├── context/
|       |   |
│       │   └── AuthContext.js
|       |
│       ├── services/
|       |   |
│       │   └── api.js
|       |
│       ├── utils/
|       |   |
│       │   └── constants.js
|       |
│       ├── styles/
|       |   |
│       │   └── globals.css
|       |
│       ├── App.js
|       |
│       └── index.js
|
└── api-testing/
    |
    |_ postman-collection.json

    
🎯 Usage Guide
For Students

Registration

Visit the application URL
Click "Create Account"
Fill in required details (name, email, password, registration number)
Submit registration form


Login

Enter email and password
Click "Sign In"


Taking an Exam

Click "Start Exam" from dashboard
Answer questions using multiple choice options
Use "Previous" and "Next" buttons to navigate
Monitor the timer in the top bar
Submit exam manually or wait for auto-submit


Viewing Results

Results are displayed immediately after submission
View detailed breakdown of correct/incorrect answers
Access exam history from dashboard



For Developers

Adding New Questions

Modify utils/seedQuestions.js
Run npm run seed to update database


Customizing Timer

Update EXAM_CONFIG.TIME_LIMIT in utils/constants.js


Styling Modifications

Edit styles/globals.css for global styles
Component-specific styles are inline



🧪 Testing
Manual Testing

Register a new user
Login with credentials
Start an exam
Navigate through questions
Submit exam
View results

API Testing with Postman

Import api-testing/postman-collection.json
Set base URL to http://localhost:5000/api
Run the collection tests

API Testing with cURL
Refer to api-testing/curl-commands.md for comprehensive cURL examples.
🔒 Security Features

Password Hashing: bcrypt with salt rounds
JWT Authentication: Secure token-based auth
Input Validation: Server-side validation using express-validator
CORS Protection: Configured for frontend domain
Environment Variables: Sensitive data stored securely
Protected Routes: Authentication middleware for secure endpoints

🎨 UI/UX Features

Responsive Design: Mobile-first approach
Modern UI: Clean, professional interface
Loading States: User-friendly loading indicators
Error Handling: Informative error messages
Accessibility: Keyboard navigation and screen reader support
Progress Indicators: Visual feedback for exam progress

📊 Database Schema
User Model
javascript{
  name: String,
  email: String (unique),
  password: String (hashed),
  registrationNumber: String (unique),
  createdAt: Date,
  updatedAt: Date
}
Question Model
javascript
{
  question: String,
  options: [String],
  correctAnswer: Number,
  difficulty: String,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
Result Model
javascript
{
  userId: ObjectId,
  questions: [{
    questionId: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  score: Number,
  totalQuestions: Number,
  percentage: Number,
  timeSpent: Number,
  completedAt: Date
}
🚀 Deployment
Environment Setup
Production Backend (.env)
envNODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret-key
Production Frontend (.env)
envREACT_APP_API_URL=https://your-backend-domain
