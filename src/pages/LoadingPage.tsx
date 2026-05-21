import { useState, useEffect } from 'react';

const MESSAGES = [
  '에니어그램 분석 중...',
  'K-장녀 여부 확인 중...',
  '행동 패턴 대조 중...',
  '성벽 안 들여다보는 중...',
  '내면의 목소리 듣는 중...',
  '가장 잘 맞는 유형 찾는 중...',
];

export function LoadingPage() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 420);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page loading-page">
      <div className="loading-content">
        <div className="loading-spinner" />
        <p className="loading-msg">{MESSAGES[msgIndex]}</p>
      </div>
    </div>
  );
}
