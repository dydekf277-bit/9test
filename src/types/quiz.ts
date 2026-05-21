export interface ExploreQuestion {
  situation: string;
  optionA: string;
  optionB: string;
  next: {
    A: string | { verify: number };
    B: string | { verify: number };
  };
}

export interface VerifyQuestion {
  situation: string;
  optionA: string;
  optionB: string;
}

export interface TypeColor {
  main: string;
  dark: string;
  light: string;
  accent: string;
  headerGradient: string[];
}

export interface PersonalityType {
  id: number;
  name: string;
  subtitle: string;
  tag: string;
  emoji: string;
  color: TypeColor;
  factPunch: string[];
  youAre: string[];
  shadow: string[];
}

export interface VerifyAttempt {
  type: number;
  aCount: number;
}

export interface QuizState {
  phase: 'start' | 'question' | 'result';
  exploreKey: string;
  verifyType: number | null;
  verifyIndex: number;
  currentACount: number;
  verifyAttempts: VerifyAttempt[];
  isExtraVerify: boolean;
  displayStep: number;
  resultType: number | null;
}

export interface CurrentQuestion {
  isVerify: boolean;
  question: {
    situation: string;
    optionA: string;
    optionB: string;
  };
}
