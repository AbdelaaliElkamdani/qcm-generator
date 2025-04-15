import { useEffect, useState } from "react"

const Question = ({ 
  question, 
  submitAnswers,
  questionNumber, 
  totalQuestions, 
  currentQuestion,
  setCurrentQuestion, 
  userAnswers,
  setUserAnswers,
  loading
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState([])

  // Met à jour les réponses sélectionnées
  const handleSelectAnswer = (answer) => {
    setSelectedAnswers((prev) => 
      question?.question_type === "multiple"
        ? prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]
        : [answer] 
    )
  }

  const nextQuestion = () => {

    setUserAnswers((prev) => [...prev, { id: question?.id, answer: selectedAnswers }])

      setSelectedAnswers([])
      setCurrentQuestion((prev) => prev + 1)
  }

  useEffect(() => {

    if (userAnswers.length === totalQuestions) {
      submitAnswers()
    }

  }, [userAnswers, totalQuestions, submitAnswers])

  return (
    <div className="qcm-card">
      <div className="question-progress">
        Question {questionNumber} sur {totalQuestions}
      </div>

      <h2 className="question-text">{question?.text}</h2>

      <div className="options">
        {question?.options?.map((answer, index) => (
          <button
            key={index}
            className={`option ${selectedAnswers.includes(answer) ? "selected" : ""}`}
            onClick={() => handleSelectAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>

      <div className="navigation-buttons">
        {currentQuestion > 0 && (
          <button className="btn-nav" onClick={() => setCurrentQuestion((prev) => prev - 1)}>
            Précédent
          </button>
        )}
        <button 
          className="btn-nav" 
          onClick={nextQuestion} 
          disabled={selectedAnswers.length === 0}
        >
          {currentQuestion === totalQuestions - 1 ? loading ? "Chargement..." : "Valider" : "Suivant"}
        </button>
      </div>
    </div>
  )
}

export default Question
