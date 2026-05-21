interface StartPageProps {
  onStart: () => void;
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="page start-page">
      <div className="start-body">
        <div className="start-emoji">🔮</div>
        <h1 className="start-title">9가지 성격 테스트</h1>
        <p className="start-subtitle">나도 몰랐던 내 행동의 이유</p>
        <div className="start-chips">
          <span className="chip">⏱ 약 2분</span>
          <span className="chip">🧬 에니어그램 기반</span>
          <span className="chip">9가지 유형</span>
        </div>
      </div>
      <div className="start-footer">
        <button className="btn-primary" onClick={onStart}>
          테스트 시작하기
        </button>
      </div>
    </div>
  );
}
