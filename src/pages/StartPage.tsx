interface StartPageProps {
  onStart: () => void;
}

const CHAR_SIZE = 82;
const RADIUS = 135;
const CENTER = 177;

const CHARS = [9, 1, 2, 3, 4, 5, 6, 7, 8].map((id, i) => {
  const rad = (i * 40 * Math.PI) / 180;
  return {
    id,
    style: {
      left: Math.round(CENTER + RADIUS * Math.sin(rad) - CHAR_SIZE / 2),
      top:  Math.round(CENTER - RADIUS * Math.cos(rad) - CHAR_SIZE / 2),
    },
  };
});

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="page start-page">
      <div className="start-body">

        <div className="enneagram-circle">
          {CHARS.map(({ id, style }) => (
            <img
              key={id}
              src={`/images/type${id}.png`}
              alt={`${id}번 유형`}
              className="enneagram-char"
              style={style as React.CSSProperties}
            />
          ))}
          <div className="circle-center-text">
            9가지<br />성격 테스트
          </div>
        </div>

        <p className="start-subtitle">MBTI보다 정확한 내 성격을 알아봐요</p>

      </div>

      <div className="start-footer">
        <div className="start-badges">
          <span className="start-badge">소요시간 2분</span>
          <span className="start-badge">에니어그램</span>
        </div>
        <button className="btn-start" onClick={onStart}>
          테스트 시작하기
        </button>
      </div>
    </div>
  );
}
