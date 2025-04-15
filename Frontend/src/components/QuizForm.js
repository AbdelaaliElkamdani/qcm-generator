import { useState } from "react"

const QuizForm = ({ onSubmit }) => {
  const [subject, setSubject] = useState("")
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [language, setLanguage] = useState("fr")
  const [questionType, setQuestionType] = useState("choix unique")
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("topic", subject)
    formData.append("num_questions", numberOfQuestions)
    formData.append("language", language)
    formData.append("question_type", questionType)
    if (file) {
      formData.append("file", file)
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <div>
        <label htmlFor="subject">Sujet:</label>
        <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="numberOfQuestions">Nombre de questions:</label>
        <input
          type="number"
          id="numberOfQuestions"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          min="1"
          required
        />
      </div>
      <div>
        <label htmlFor="language">Langue:</label>
        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
      <div>
        <label htmlFor="questionType">Type de QCM:</label>
        <select id="questionType" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
          <option value="single">Choix unique</option>
          <option value="multiple">Choix multiple</option>
        </select>
      </div>
      <div>
        <label htmlFor="file">Fichier de cours (facultatif):</label>
        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button type="submit">Commencer le quiz</button>
    </form>
  )
}

export default QuizForm

