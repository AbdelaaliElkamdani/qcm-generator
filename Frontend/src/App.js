import { useState } from "react"
import axios from "axios"
import "./App.css"
import SideBar from "./components/SideBar"
import QuizForm from "./components/QuizForm"
import Question from "./components/Question"
import Score from "./components/Score"
import QuestionSkeleton from "./components/QuestionSkeleton"

function App() {
  const [questions, setQuestions] = useState([
    {
      id: 75,
      text: "Quel est le type primitif qui stocke des caractères en Java?",
      options: [
        "int",
        "float",
        "char",
        "String"
      ],
      correct_answers: [
        "char"
      ],
      question_type: "single"
    },
    {
      id: 76,
      text: "Quel modificateur d'accès rend une variable accessible à toutes les classes de l'application?",
      options: [
        "private",
        "protected",
        "public",
        "final"
      ],
      correct_answers: [
        "public"
      ],
      question_type: "single"
    }
  ])
  const [data, setData] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState({})
  const [showScore, setShowScore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])

  const startQuiz = async (quizParams) => {
    setLoading(true)
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generate/", quizParams)
      setData(response.data)
      console.log(data)
      setQuestions(response.data.questions)
      setQuizStarted(true)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswers = async (lastAnswer) => {
    setLoading(true)
    try {
      console.log(userAnswers)
      const response = await axios.post("http://127.0.0.1:8000/api/answers/", {
        quiz_id: data.id,
        answers: userAnswers,
      })
      setScore(response.data)
      setShowScore(true)
      setLoading(false)
    } catch (error) {
      console.error("Error submitting answers:", error)
    } finally {
      setLoading(false)
    }
  }
  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setQuizStarted(false)
    setUserAnswers([])
  }

  return (
    <div className="app">
      <div className="app-header">
        <SideBar />
      </div>

      <div className="quiz-content">
        <h1>Nouveau QCM</h1>
        <QuizForm onSubmit={startQuiz} />
      </div>

      <div className="app-content">

        {quizStarted ? (
          showScore ? (
            <Score score={score?.score} status={score?.status} total={questions.length} restartQuiz={restartQuiz} questions={questions} />
          ) : (
            <Question
              question={questions[currentQuestion]}
              submitAnswers={submitAnswers}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              loading={loading}
            />
          )
        ) : (
          !loading ? <h1 style={{ color: "white", textAlign: "center", width: "100%", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Remplissez le formulaire pour demarrer le quiz</h1>
          : <QuestionSkeleton />
        )}

      </div>
    </div>
  )
}

export default App

