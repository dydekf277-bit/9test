import { useState, useEffect } from 'react';

const MESSAGES = [
  '숨겨진 성향 정리 중...',
  '자아 구조 연결 중...',
  '감정 회로 분석 중...',
  '무의식 패턴 로딩 중...',
  '속마음 번역 중...',
  '가장 가까운 유형 찾는 중...',
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
