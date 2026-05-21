import { useState } from 'react';
import questionsData from '../data/questions.json';
import type { QuizState, VerifyAttempt, CurrentQuestion } from '../types/quiz';

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
};

function computeNext(s: QuizState, choice: 'A' | 'B'): QuizState {
  const newStep = Math.min(s.displayStep + 1, 6);

  if (s.verifyType === null) {
    // 탐색 단계
    const exploreQ = q.explore[s.exploreKey];
    const next = exploreQ.next[choice];

    if (typeof next === 'string') {
      return { ...s, exploreKey: next, displayStep: newStep };
    } else {
      // 검증 단계 진입
      return {
        ...s,
        verifyType: next.verify,
        verifyIndex: 0,
        currentACount: 0,
        verifyAttempts: [],
        displayStep: newStep,
      };
    }
  } else {
    // 검증 단계
    const newACount = s.currentACount + (choice === 'A' ? 1 : 0);

    if (s.verifyIndex < 2) {
      return {
        ...s,
        verifyIndex: s.verifyIndex + 1,
        currentACount: newACount,
        displayStep: newStep,
      };
    }

    // 마지막 검증 문항 처리
    const updatedAttempts: VerifyAttempt[] = [
      ...s.verifyAttempts,
      { type: s.verifyType, aCount: newACount },
    ];

    if (newACount >= q.logic.verifyThreshold) {
      return { ...s, phase: 'result', resultType: s.verifyType, verifyAttempts: updatedAttempts, displayStep: 6 };
    }

    // 인접 유형 재검증
    const adjacency: number[] = q.adjacency[String(s.verifyType)];
    const tried = updatedAttempts.map((a: VerifyAttempt) => a.type);
    const nextType = adjacency.find((t: number) => !tried.includes(t));

    if (nextType !== undefined && updatedAttempts.length < q.logic.maxVerifyAttempts) {
      return {
        ...s,
        verifyType: nextType,
        verifyIndex: 0,
        currentACount: 0,
        verifyAttempts: updatedAttempts,
        isExtraVerify: true,
        displayStep: newStep,
      };
    }

    // 최대 시도 소진 → A 가장 많은 유형 선택 (동점 시 첫 번째 우선)
    const best = updatedAttempts.reduce((prev, curr) =>
      curr.aCount > prev.aCount ? curr : prev
    );
    return { ...s, phase: 'result', resultType: best.type, verifyAttempts: updatedAttempts, displayStep: 6 };
  }
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(INITIAL);
  const [history, setHistory] = useState<QuizState[]>([]);

  const start = () => {
    setHistory([]);
    setState({ ...INITIAL, phase: 'question' });
  };

  const answer = (choice: 'A' | 'B') => {
    setHistory(h => [...h, state]);
    setState(prev => computeNext(prev, choice));
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setState(prev);
  };

  const restart = () => {
    setHistory([]);
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
    currentQuestion: getCurrentQuestion(),
    start,
    answer,
    goBack,
    restart,
  };
}
