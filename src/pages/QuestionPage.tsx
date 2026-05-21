import type { CurrentQuestion } from '../types/quiz';

interface QuestionPageProps {
  questionData: CurrentQuestion;
  displayStep: number;
  isExtraVerify: boolean;
  canGoBack: boolean;
  onAnswer: (choice: 'A' | 'B') => void;
  onBack: () => void;
}

export function QuestionPage({
  questionData,
  displayStep,
  isExtraVerify,
  canGoBack,
  onAnswer,
  onBack,
}: QuestionPageProps) {
  const { question } = questionData;
  const progress = (displayStep / 6) * 100;

  return (
    <div className="page question-page">
      {/* 상단 네비 */}
      <div className="question-nav">
        <button
          className="back-btn"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="이전 문항"
        >
          ←
        </button>
        <div className="progress-wrap">
          <div
            className={`progress-fill ${isExtraVerify ? 'extra' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 추가 검증 배너 */}
      {isExtraVerify && (
        <div className="extra-badge">✨ 더 정확하게 알아보는 중...</div>
      )}

      {/* 질문 본문 */}
      <div className="question-content">
        <div className="situation-card">
          <p className="situation-text">{question.situation}</p>
        </div>

        <div className="options">
          <button className="option-btn" onClick={() => onAnswer('A')}>
            <span className="option-label">A</span>
            <span className="option-text">{question.optionA}</span>
          </button>
          <button className="option-btn" onClick={() => onAnswer('B')}>
            <span className="option-label">B</span>
            <span className="option-text">{question.optionB}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
