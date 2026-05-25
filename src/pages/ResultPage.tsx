import { useState } from 'react';
import { getTossShareLink, share } from '@apps-in-toss/web-bridge';
import type { PersonalityType } from '../types/quiz';

interface ResultPageProps {
  typeData: PersonalityType;
  onRestart: () => void;
}

export function ResultPage({ typeData, onRestart }: ResultPageProps) {
  const { id, name, subtitle, tag, emoji, color, factPunch, youAre, shadow } = typeData;
  const isDark = id === 1;
  const [imgFailed, setImgFailed] = useState(false);

  const headerGradient = `linear-gradient(160deg, ${color.headerGradient[0]}, ${color.headerGradient[1]}, ${color.headerGradient[2]})`;
  const textColor = isDark ? '#ffffff' : '#2C2C2A';
  const mutedColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)';

  const handleShare = async () => {
    const ogImageUrl = 'https://raw.githubusercontent.com/dydekf277-bit/9test/main/public/og.png';
    const tossLink = await getTossShareLink('intoss://9personality', ogImageUrl);
    await share({
      message: `MBTI보다 정확한 내 성격을 알아볼 수 있어요.\n\n${tossLink}`,
    });
  };

  return (
    <div className="page result-page">

      {/* ── 헤더 ── */}
      <div className="result-header" style={{ background: headerGradient }}>
        <span className="type-label" style={{ color: mutedColor }}>TYPE {id}</span>

        <div className="result-names">
          <p className="result-subtitle" style={{ color: textColor }}>{subtitle}</p>
          <h1 className="result-name" style={{ color: textColor }}>{name}</h1>
        </div>

        {imgFailed ? (
          <span className="character-fallback-emoji">{emoji}</span>
        ) : (
          <img
            src={`/images/type${id}.png`}
            alt={name}
            className="character-img"
            onError={() => setImgFailed(true)}
          />
        )}

        <div className="speech-bubble" style={{ color: color.main }}>
          {tag}
        </div>
      </div>

      {/* ── 바디 ── */}
      <div className="result-body">

        {/* 팩폭 섹션 */}
        <section className="result-section">
          <h2 className="section-title center" style={{ color: color.dark }}>
            {emoji} {id}유형 사람들은 {emoji}
          </h2>
          <ol className="fact-list">
            {factPunch.map((fact, i) => (
              <li key={i} className="fact-item">
                <span className="fact-num" style={{ color: color.main }}>{i + 1}</span>
                <span className="fact-text">{fact}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 더 읽어보기 accordion */}
        <details className="read-more">
          <summary className="read-more-summary" style={{ color: color.dark }}>
            더 읽어보기
            <span className="chevron">▾</span>
          </summary>

          <div className="read-more-body">
            {/* 너는 이런 사람이야 */}
            <section className="result-section">
              <h2 className="section-title" style={{ color: color.dark }}>
                {emoji} 너는 이런 사람이야
              </h2>
              {youAre.map((para, i) => (
                <p key={i} className="body-text">{para}</p>
              ))}
            </section>

            <div className="divider" />

            {/* 너의 그림자 */}
            <section className="result-section shadow-section">
              <h2 className="section-title" style={{ color: color.dark }}>
                🌙 너의 그림자
              </h2>
              {shadow.map((para, i) => (
                <p key={i} className="body-text">{para}</p>
              ))}
            </section>
          </div>
        </details>

        {/* CTA 버튼 */}
        <div className="cta-buttons">
          <button
            className="btn-cta-outline"
            onClick={onRestart}
          >
            다시 해보기
          </button>
          <button
            className="btn-cta-share"
            style={{ background: color.main }}
            onClick={handleShare}
          >
            공유하기
          </button>
        </div>

      </div>
    </div>
  );
}
