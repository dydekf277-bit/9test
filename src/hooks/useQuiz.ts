import { useState } from 'react';
import questionsData from '../data/questions.json';
import type { QuizState, VerifyAttempt, CurrentQuestion, HistoryEntry } from '../types/quiz';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const q = questionsData as any;

const INITIAL: QuizState = {
  phase: 'start',
  exploreKey: 'Q1',
  verifyType: null,
  verifyIndex: 0,
  currentACount: 0,
  verifyAttempts: [],
  isExtraVerify: false,
  displayStep: 1,
  resultType: null,
  restoredChoice: null,
  centerFirstChoice: null,
  centerAmbiguous: false,
};

const BODY_TYPES = [8, 9, 1];

function computeNext(s: QuizState, choice: 'A' | 'B'): QuizState {
  const newStep = Math.min(s.displayStep + 1, 8);

  if (s.verifyType === null) {
    // Q1: 1차 중심 선택 → Q1b로 이동하며 centerFirstChoice 저장
    if (s.exploreKey === 'Q1') {
      return { ...s, exploreKey: 'Q1b', centerFirstChoice: choice, displayStep: newStep, restoredChoice: null };
    }

    // Q1b: 다수결로 중심 판정
    if (s.exploreKey === 'Q1b') {
      const bothBody = s.centerFirstChoice === 'A' && choice === 'A';
      const nextKey = bothBody ? 'Q2' : 'Q3';
      const ambiguous = !bothBody && !(s.centerFirstChoice === 'B' && choice === 'B');
      return {
        ...s,
        exploreKey: nextKey,
        centerFirstChoice: null,
        centerAmbiguous: ambiguous,
        displayStep: newStep,
        restoredChoice: null,
      };
    }

    const exploreQ = q.explore[s.exploreKey];
    const next = exploreQ.next[choice];

    if (typeof next === 'string') {
      return { ...s, exploreKey: next, displayStep: newStep, restoredChoice: null };
    } else {
      return {
        ...s,
        verifyType: next.verify,
        verifyIndex: 0,
        currentACount: 0,
        verifyAttempts: [],
        displayStep: newStep,
        restoredChoice: null,
      };
    }
  } else {
    const newACount = s.currentACount + (choice === 'A' ? 1 : 0);

    if (s.verifyIndex < 2) {
      return {
        ...s,
        verifyIndex: s.verifyIndex + 1,
        currentACount: newACount,
        displayStep: newStep,
        restoredChoice: null,
      };
    }

    const updatedAttempts: VerifyAttempt[] = [
      ...s.verifyAttempts,
      { type: s.verifyType, aCount: newACount },
    ];

    if (newACount >= q.logic.verifyThreshold) {
      return { ...s, phase: 'result', resultType: s.verifyType, verifyAttempts: updatedAttempts, displayStep: 8, restoredChoice: null };
    }

    const adjacency: number[] = q.adjacency[String(s.verifyType)];
    const tried = updatedAttempts.map((a: VerifyAttempt) => a.type);
    let nextType = adjacency.find((t: number) => !tried.includes(t));

    if (nextType === undefined && s.centerAmbiguous) {
      nextType = BODY_TYPES.find((t: number) => !tried.includes(t));
    }

    if (nextType !== undefined && updatedAttempts.length < q.logic.maxVerifyAttempts) {
      return {
        ...s,
        verifyType: nextType,
        verifyIndex: 0,
        currentACount: 0,
        verifyAttempts: updatedAttempts,
        isExtraVerify: true,
        displayStep: newStep,
        restoredChoice: null,
      };
    }

    const best = updatedAttempts.reduce((prev, curr) =>
      curr.aCount > prev.aCount ? curr : prev
    );
    return { ...s, phase: 'result', resultType: best.type, verifyAttempts: updatedAttempts, displayStep: 8, restoredChoice: null };
  }
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(INITIAL);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [questionSeq, setQuestionSeq] = useState(0);

  const start = () => {
    setHistory([]);
    setQuestionSeq(0);
    setState({ ...INITIAL, phase: 'question' });
  };

  const answer = (choice: 'A' | 'B') => {
    setHistory(h => [...h, { state, choice }]);
    setQuestionSeq(n => n + 1);
    setState(prev => computeNext(prev, choice));
  };

  const goBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setQuestionSeq(n => n + 1);
    setState({ ...last.state, restoredChoice: last.choice });
  };

  const restart = () => {
    setHistory([]);
    setQuestionSeq(0);
    setState(INITIAL);
  };

  const getCurrentQuestion = (): CurrentQuestion | null => {
    if (state.phase !== 'question') return null;
    if (state.verifyType === null) {
      return { isVerify: false, question: q.explore[state.exploreKey] };
    }
    return {
      isVerify: true,
      question: q.verify[String(state.verifyType)][state.verifyIndex],
    };
  };

  return {
    state,
    canGoBack: history.length > 0,
    questionSeq,
    currentQuestion: getCurrentQuestion(),
    start,
    answer,
    goBack,
    restart,
  };
}
