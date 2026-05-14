import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import React from "react";

// ── palette ──────────────────────────────────────────────────────────────────
const BG = "#0a0a0a";
const GREEN = "#22c55e";
const WHITE = "#ffffff";
const GRAY = "#9ca3af";
const CARD_BG = "#111827";
const BORDER = "#1f2937";

// ── helpers ───────────────────────────────────────────────────────────────────
const FadeIn: React.FC<{
  from: number;
  children: React.ReactNode;
  duration?: number;
}> = ({ from, children, duration = 8 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};

const SlideUp: React.FC<{
  from: number;
  children: React.ReactNode;
  delay?: number;
}> = ({ from, children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - from - delay, fps, config: { damping: 14, stiffness: 120 } });
  const y = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return <div style={{ transform: `translateY(${y}px)`, opacity }}>{children}</div>;
};

// ── bill row ─────────────────────────────────────────────────────────────────
const BillRow: React.FC<{
  label: string;
  amount: string;
  flagged?: boolean;
  startFrame: number;
  index: number;
}> = ({ label, amount, flagged, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame - index * 4,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const x = interpolate(progress, [0, 1], [-60, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 32px",
        background: flagged ? "rgba(239,68,68,0.08)" : CARD_BG,
        border: `1px solid ${flagged ? "rgba(239,68,68,0.3)" : BORDER}`,
        borderRadius: 16,
        transform: `translateX(${x}px)`,
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {flagged && (
          <span style={{ fontSize: 28 }}>🚨</span>
        )}
        <span style={{ color: flagged ? "#fca5a5" : WHITE, fontSize: 34, fontFamily: "sans-serif", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <span style={{ color: flagged ? "#ef4444" : GRAY, fontSize: 34, fontFamily: "monospace", fontWeight: 700 }}>
        {amount}
      </span>
    </div>
  );
};

// ── saving badge ──────────────────────────────────────────────────────────────
const SavingsBadge: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 10, stiffness: 80 } });
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        borderRadius: 24,
        padding: "40px 56px",
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        boxShadow: "0 0 60px rgba(34,197,94,0.4)",
      }}
    >
      <div style={{ color: WHITE, fontSize: 40, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 8 }}>
        money found
      </div>
      <div style={{ color: WHITE, fontSize: 100, fontFamily: "sans-serif", fontWeight: 800, lineHeight: 1 }}>
        $94
        <span style={{ fontSize: 52 }}>/mo</span>
      </div>
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 34, fontFamily: "sans-serif", marginTop: 12 }}>
        that's $1,128 every year 💸
      </div>
    </div>
  );
};

// ── scene components ──────────────────────────────────────────────────────────

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame / 15) * 2;

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <FadeIn from={0}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 24 }}>👀</div>
          <div
            style={{
              color: WHITE,
              fontSize: 62,
              fontFamily: "sans-serif",
              fontWeight: 800,
              lineHeight: 1.2,
              textAlign: "center",
              transform: `scale(${1 + pulse * 0.002})`,
            }}
          >
            POV: you uploaded your bills and found this
          </div>
          <div style={{ color: GRAY, fontSize: 36, fontFamily: "sans-serif", marginTop: 28 }}>
            took me 2 minutes
          </div>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

const SceneUpload: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dotCount = Math.floor((frame / 10) % 4);
  const dots = ".".repeat(dotCount);

  return (
    <AbsoluteFill style={{ background: BG, padding: 60, justifyContent: "center" }}>
      <SlideUp from={0}>
        <div style={{ color: GRAY, fontSize: 34, fontFamily: "sans-serif", marginBottom: 40 }}>
          me at midnight uploading all my bills to this app
        </div>
      </SlideUp>

      {/* mock upload UI */}
      <SlideUp from={0} delay={6}>
        <div
          style={{
            background: CARD_BG,
            border: `2px dashed ${GREEN}`,
            borderRadius: 24,
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 20 }}>📄</div>
          <div style={{ color: GREEN, fontSize: 38, fontFamily: "sans-serif", fontWeight: 700 }}>
            analyzing your bills{dots}
          </div>
          <div style={{ color: GRAY, fontSize: 30, fontFamily: "sans-serif", marginTop: 16 }}>
            internet · phone · subscriptions · insurance
          </div>
        </div>
      </SlideUp>

      <SlideUp from={0} delay={10}>
        <div
          style={{
            marginTop: 32,
            padding: "20px 32px",
            background: "rgba(34,197,94,0.1)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: GREEN }} />
          <div style={{ color: GREEN, fontSize: 30, fontFamily: "sans-serif" }}>
            costra ai · find money you're already losing
          </div>
        </div>
      </SlideUp>
    </AbsoluteFill>
  );
};

const SceneResults: React.FC = () => (
  <AbsoluteFill style={{ background: BG, padding: "60px 48px" }}>
    <FadeIn from={0} duration={6}>
      <div style={{ color: WHITE, fontSize: 44, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 8 }}>
        here's what it found 👇
      </div>
      <div style={{ color: GRAY, fontSize: 30, fontFamily: "sans-serif", marginBottom: 40 }}>
        i had no idea about most of this
      </div>
    </FadeIn>

    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BillRow label="Gym membership #1" amount="$29.99" flagged startFrame={6} index={0} />
      <BillRow label="Gym membership #2 💀" amount="$24.99" flagged startFrame={6} index={1} />
      <BillRow label="Adobe (never use)" amount="$54.99" flagged startFrame={6} index={2} />
      <BillRow label="Internet — overpaying" amount="$21/mo" flagged startFrame={6} index={3} />
      <BillRow label="Car insurance" amount="✓ ok" startFrame={6} index={4} />
    </div>
  </AbsoluteFill>
);

const SceneSavings: React.FC = () => (
  <AbsoluteFill
    style={{ background: BG, padding: "60px 48px", justifyContent: "center", alignItems: "center" }}
  >
    <SavingsBadge startFrame={0} />

    <FadeIn from={20}>
      <div
        style={{
          marginTop: 48,
          textAlign: "center",
          color: GRAY,
          fontSize: 36,
          fontFamily: "sans-serif",
          lineHeight: 1.5,
        }}
      >
        I had TWO gym memberships
        <br />
        and didn't even go to either 😭
      </div>
    </FadeIn>
  </AbsoluteFill>
);

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #052e16 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>💰</div>
        <div
          style={{
            color: WHITE,
            fontSize: 58,
            fontFamily: "sans-serif",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          find money you're already losing
        </div>
        <div
          style={{
            background: GREEN,
            borderRadius: 60,
            padding: "28px 64px",
            display: "inline-block",
            color: "#000",
            fontSize: 42,
            fontFamily: "sans-serif",
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          try costra free →
        </div>
        <div style={{ color: GRAY, fontSize: 32, fontFamily: "sans-serif" }}>
          costra.ai · link in bio
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── main composition ──────────────────────────────────────────────────────────
// Timeline (30fps):
//   0–75    (0–2.5s)  Hook
//   75–210  (2.5–7s)  Upload / analyzing
//   210–450 (7–15s)   Results reveal
//   450–630 (15–21s)  Savings badge
//   630–900 (21–30s)  CTA

export const CostraScroll: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={75}>
      <SceneHook />
    </Sequence>
    <Sequence from={75} durationInFrames={135}>
      <SceneUpload />
    </Sequence>
    <Sequence from={210} durationInFrames={240}>
      <SceneResults />
    </Sequence>
    <Sequence from={450} durationInFrames={180}>
      <SceneSavings />
    </Sequence>
    <Sequence from={630} durationInFrames={270}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
