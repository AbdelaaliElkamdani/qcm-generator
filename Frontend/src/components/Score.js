import React, { useState } from "react"

const Score = ({ score, total, restartQuiz, questions, status }) => {
  const [showCorrection, setShowCorrection] = useState(false)

  return (
    <div className="score-card">
      <div className="score-content">
        <div className="score-header">
          <h2 style={{ color: status === "zero"? "red" : "#6e8efb" }}>

            {
            status === "excellent" ? "Tres bien!" : 

            status === "good" ? "Bien !" :

            status === "passing" ? "Assez bien !" :

            status === "acceptable" ? "Passable" :

            "Mauvais !"

            }
            
            </h2>
          <div className="score-result">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {total}</span>
          </div>
          <p>Erreurs : {total - score}</p>
        </div>
        <div className="score-actions">
          <button onClick={restartQuiz} className="btn btn-primary">
            Rejouer
          </button>
          <button onClick={() => setShowCorrection(!showCorrection)} className="btn btn-secondary">
            {showCorrection ? "Masquer" : "Afficher"} la correction
          </button>
        </div>
      </div>
      {showCorrection && (
        <div className="score-correction">
          <h3>Correction</h3>
          <ul className="correction-list">
            {questions.map((question, index) => (
              <li key={question.id} className="correction-item">
                <strong>Question {index + 1}:</strong> {question.text}
                <ul className="options-list">
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      className={`option-item ${question.correct_answers.indexOf(option) !== -1 ? "correct" : "incorrect"}`}
                    >
                      <strong>Option {index + 1}:</strong> {option}
                      {question.correct_answers.indexOf(option) !== -1 ? (
                        <span className="badge correct">Correct</span>
                      ) : (
                        <span className="badge incorrect">Incorrect</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Score

