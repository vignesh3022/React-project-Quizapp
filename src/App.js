// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_API_URL = 'https://opentdb.com/api.php?type=multiple';

function App() {
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      // Fetch questions from Open Trivia Database API based on user input
      fetch(`${BASE_API_URL}&amount=${totalQuestions}`)
        .then(response => response.json())
        .then(data => setQuestions(data.results || []))
        .catch(error => console.error('Error fetching questions:', error));
    }
  }, [quizStarted, quizCompleted, totalQuestions]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (questions && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      // Quiz completed
      endQuiz();
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0); 
    setUserAnswers([]);
  };

  const endQuiz = () => {
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setTotalQuestions(5); // Reset to default value
    setCurrentQuestion(0);
    setScore(0);
    setQuestions([]);
    setUserAnswers([]);
  };

  return (
    <div className="app">
      <h1>Quiz App</h1>
      {!quizStarted && !quizCompleted ? (
        <div>
          <p>Enter the number of questions you want to answer:</p>
          <input
            type="number"
            min="1"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Math.max(1, parseInt(e.target.value, 10)))}
          />
          <button className="start-button" onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : (
        <div className="question-container">
          {questions && questions.length > 0 && !quizCompleted ? (
            <>
              <h2>{questions[currentQuestion].question}</h2>
              <div className="options-container">
                {shuffleOptions(questions[currentQuestion].incorrect_answers.concat(questions[currentQuestion].correct_answer)).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleAnswer(option === questions[currentQuestion].correct_answer);
                      setUserAnswers(prevAnswers => [...prevAnswers, { question: questions[currentQuestion].question, correctAnswer: questions[currentQuestion].correct_answer, userAnswer: option }]);
                    }}
                    disabled={quizCompleted}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>{quizCompleted ? 'Quiz completed!' : 'Loading questions...'}</p>
          )}
          {quizCompleted && (
            <>
              <h3>Quiz Summary</h3>
              <p className="score">Your Score: {score}</p>
              <table className="summary-table">
                <thead > 
                  <tr className="summary-heading">
                    <th>Question</th>
                    <th>Correct Answer</th>
                    <th>Your Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {userAnswers.map((ua, index) => (
                    <tr key={index}>
                      <td>{ua.question}</td>
                      <td>{ua.correctAnswer}</td>
                      <td>{ua.userAnswer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="restart-button" onClick={resetQuiz}>Restart Quiz</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Function to shuffle options
function shuffleOptions(options) {
  return options.sort(() => Math.random() - 0.5);
}

export default App;