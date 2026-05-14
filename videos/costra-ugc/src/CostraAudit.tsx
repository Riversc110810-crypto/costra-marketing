import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import React from "react";

const BG = "#0a0a0a";
const GREEN = "#22c55e";
const WHITE = "#ffffff";
const GRAY = "#9ca3af";
const CARD_BG = "#111827";

const FadeIn: React.FC<{ from: number; children: React.ReactNode; duration?: number }> = ({
  from, children, duration = 8,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};

const FindingCard: React.FC<{
  emoji: string;
  label: string;
  detail: string;
  amount: string;
  startFrame: number;
  index: number;
}> = ({ emoji, label, detail, amount, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame - index * 8,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const y = interpolate(progress, [0, 1], [50, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: CARD_BG,
        border: "1px solid #1f2937",
        borderRadius: 20,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      <span style={{ fontSize: 44 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: WHITE, fontSize: 32, fontFamily: "sans-serif", fontWeight: 600 }}>{label}</div>
        <div style={{ color: GRAY, fontSize: 26, fontFamily: "sans-serif", marginTop: 4 }}>{detail}</div>
      </div>
      <div
        style={{
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10,
          padding: "8px 20px",
          color: "#ef4444",
          fontSize: 28,
          fontFamily: "monospace",
          fontWeight: 700,
        }}
      >
        {amount}
      </div>
    </div>
  );
};

const SceneIntro: React.FC = () => (
  <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: 60 }}>
    <FadeIn from={0}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 24 }}>🧾</div>
        <div
          style={{
            color: WHITE,
            fontSize: 56,
            fontFamily: "sans-serif",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          things i found hiding in my monthly expenses
        </div>
        <div style={{ color: GRAY, fontSize: 34, fontFamily: "sans-serif" }}>
          ran my bills through an AI last night
        </div>
      </div>
    </FadeIn>
  </AbsoluteFill>
);

const SceneFindings: React.FC = () => (
  <AbsoluteFill style={{ background: BG, padding: "60px 48px" }}>
    <FadeIn from={0} duration={6}>
      <div style={{ color: GREEN, fontSize: 36, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 32 }}>
        costra found these in 2 min 👇
      </div>
    </FadeIn>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <FindingCard
        emoji="📺"
        label="streaming I cancelled"
        detail="still charging since Jan"
        amount="+$15.99"
        startFrame={6}
        index={0}
      />
      <FindingCard
        emoji="📱"
        label="app I used once in 2023"
        detail="auto-renews every month"
        amount="+$8.99"
        startFrame={6}
        index={1}
      />
      <FindingCard
        emoji="🌐"
        label="internet plan"
        detail="same speed, cheaper across street"
        amount="+$20/mo"
        startFrame={6}
        index={2}
      />
      <FindingCard
        emoji="🏋️"
        label="gym I never go to"
        detail="forgot I signed up"
        amount="+$22"
        startFrame={6}
        index={3}
      />
    </div>
  </AbsoluteFill>
);

const SceneTotal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 10, stiffness: 70 } });
  const scale = interpolate(progress, [0, 1], [0.6, 1]);

  return (
    <AbsoluteFill
      style={{ background: BG, justifyContent: "center", alignItems: "center", padding: 60 }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{ color: GRAY, fontSize: 38, fontFamily: "sans-serif", marginBottom: 16 }}>
          total wasted every month
        </div>
        <div
          style={{
            color: GREEN,
            fontSize: 140,
            fontFamily: "sans-serif",
            fontWeight: 900,
            lineHeight: 1,
            textShadow: "0 0 80px rgba(34,197,94,0.5)",
          }}
        >
          $67
        </div>
        <div style={{ color: GRAY, fontSize: 38, fontFamily: "sans-serif", marginTop: 8 }}>
          per month
        </div>
      </div>

      <FadeIn from={25}>
        <div
          style={{
            marginTop: 48,
            background: CARD_BG,
            borderRadius: 20,
            padding: "28px 48px",
            textAlign: "center",
          }}
        >
          <div style={{ color: WHITE, fontSize: 36, fontFamily: "sans-serif" }}>
            this took{" "}
            <span style={{ color: GREEN, fontWeight: 700 }}>2 minutes</span>
          </div>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const y = interpolate(progress, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #052e16 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ textAlign: "center", transform: `translateY(${y}px)` }}>
        <div style={{ color: GRAY, fontSize: 36, fontFamily: "sans-serif", marginBottom: 16 }}>
          if you haven't audited your bills recently
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 54,
            fontFamily: "sans-serif",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 40,
          }}
        >
          you're probably losing money too
        </div>
        <div
          style={{
            background: GREEN,
            borderRadius: 60,
            padding: "28px 64px",
            color: "#000",
            fontSize: 42,
            fontFamily: "sans-serif",
            fontWeight: 800,
            marginBottom: 28,
          }}
        >
          upload your bills free →
        </div>
        <div style={{ color: GRAY, fontSize: 30, fontFamily: "sans-serif" }}>
          costra.ai
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Timeline:
//   0–90    hook
//   90–330  findings reveal
//   330–540 total
//   540–900 CTA

export const CostraAudit: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={90}>
      <SceneIntro />
    </Sequence>
    <Sequence from={90} durationInFrames={240}>
      <SceneFindings />
    </Sequence>
    <Sequence from={330} durationInFrames={210}>
      <SceneTotal />
    </Sequence>
    <Sequence from={540} durationInFrames={360}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
