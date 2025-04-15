const QuestionSkeleton = () => {
  return (
    <div className="qcm-card">
      <div className="question-progress">
        <div className="skeleton-text skeleton-progress"></div>
      </div>

      <h2 className="question-text">
        <div className="skeleton-text skeleton-title-1"></div>
        <div className="skeleton-text skeleton-title-2"></div>
      </h2>

      <div className="options">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="option skeleton-option">
            <div className="skeleton-option-text"></div>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <div className="btn-nav skeleton-button"></div>
      </div>
    </div>
  )
}

export default QuestionSkeleton

