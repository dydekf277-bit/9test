import { useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { StartPage } from './pages/StartPage';
import { QuestionPage } from './pages/QuestionPage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import type { PersonalityType } from './types/quiz';
import typesData from './data/types.json';
import './App.css';

const types = typesData as Record<string, PersonalityType>;

function App() {
  const quiz = useQuiz();
  const { state } = quiz;
  const [resultReady, setResultReady] = useState(false);

  useEffect(() => {
    if (state.phase === 'result') {
      setResultReady(false);
      const timer = setTimeout(() => setResultReady(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.resultType]);

  const handleRestart = () => {
    setResultReady(false);
    quiz.restart();
  };

  if (state.phase === 'start') {
    return <StartPage onStart={quiz.start} />;
  }

  if (state.phase === 'question' && quiz.currentQuestion) {
    return (
      <QuestionPage
        questionData={quiz.currentQuestion}
        displayStep={state.displayStep}
        isExtraVerify={state.isExtraVerify}
        canGoBack={quiz.canGoBack}
        onAnswer={quiz.answer}
        onBack={quiz.goBack}
      />
    );
  }

  if (state.phase === 'result' && state.resultType !== null) {
    if (!resultReady) return <LoadingPage />;
    const typeData = types[String(state.resultType)];
    return <ResultPage typeData={typeData} onRestart={handleRestart} />;
  }

  return null;
}

export default App;
