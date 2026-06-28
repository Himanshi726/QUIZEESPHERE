Quizeesphere 🧠🚀
Welcome to Quizeesphere! A comprehensive, full-stack quiz platform built with the MERN stack (MongoDB, Express, React, Node.js). It empowers users to take, create, and share quizzes seamlessly, complete with automated grading, real-time leaderboards, and exclusive private quiz hosting.

✨ Features
Secure Authentication: Cookie-based JWT authentication with bcrypt password hashing.
Email Verification: Automated email verification links sent via Nodemailer to ensure genuine user accounts.
Quiz Creation Engine: A dynamic UI for users to author their own quizzes. Add multiple questions, specify correct answers, and set strict time limits.
Public & Private Quizzes:
Publish quizzes to the public global dashboard.
Host Private Quizzes and generate a unique, shareable 6-character Join Code for 1-on-1 tests or exclusive classrooms.
Automated Grading: Quizzes are instantly graded upon submission or when the timer runs out.
Real-time Leaderboards: Compete with others and see how you rank globally on any quiz.
Certificates: Earn and download PDF certificates for scoring above 80%.
Modern UI/UX: Built with React, Vite, and Tailwind CSS. Fully responsive design featuring a seamless Dark/Light mode toggle.
🛠️ Technology Stack
Frontend:

React 19 (via Vite)
Tailwind CSS (Styling & Dark Mode)
React Router DOM (Routing)
Axios (HTTP Client)
Lucide React (Icons)
jsPDF & html2canvas (Certificate Generation)
Backend:

Node.js & Express.js
MongoDB & Mongoose (Database & ORM)
JSON Web Tokens (JWT) (Stateless authentication via httpOnly cookies)
Nodemailer (SMTP Email delivery)
Cloudinary & Multer (Image uploads)
