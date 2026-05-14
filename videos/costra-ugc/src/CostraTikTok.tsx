import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
} from "remotion";
import React from "react";

// ── brand ─────────────────────────────────────────────────────────────────────
const BG       = "#0a0a0a";
const GREEN    = "#22c55e";
const GREEN_DK = "#16a34a";
const RED      = "#ef4444";
const WHITE    = "#ffffff";
const GRAY     = "#9ca3af";
const CARD     = "#111827";
const BORDER   = "#1f2937";

// ── spring helper ─────────────────────────────────────────────────────────────
const usePop = (startFrame: number, damping = 12, stiffness = 100) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - startFrame, fps, config: { damping, stiffness } });
};

// ── fade ──────────────────────────────────────────────────────────────────────
const Fade: React.FC<{ start: number; dur?: number; children: React.ReactNode }> = ({
  start, dur = 10, children,
}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <div style={{ opacity: op }}>{children}</div>;
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — hook  (0–90, 3s)
// ══════════════════════════════════════════════════════════════════════════════
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titlePop = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const titleY   = interpolate(titlePop, [0, 1], [60, 0]);
  const titleOp  = interpolate(titlePop, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });

  const subPop = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 90 } });
  const subY   = interpolate(subPop, [0, 1], [40, 0]);
  const subOp  = interpolate(subPop, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // pulsing glow
  const glow = 0.3 + 0.15 * Math.sin(frame / 12);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 60%, rgba(34,197,94,${glow * 0.18}) 0%, ${BG} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 72px",
      }}
    >
      {/* big emoji */}
      <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOp, textAlign: "center" }}>
        <div style={{ fontSize: 110, marginBottom: 32, filter: "drop-shadow(0 0 30px rgba(34,197,94,0.5))" }}>💸</div>
        <div
          style={{
            color: WHITE,
            fontSize: 72,
            fontFamily: "sans-serif",
            fontWeight: 900,
            lineHeight: 1.1,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          you're probably losing{" "}
          <span style={{ color: GREEN }}>$50–$100</span>
          {" "}a month
        </div>
      </div>

      <div style={{ transform: `translateY(${subY}px)`, opacity: subOp, textAlign: "center", marginTop: 32 }}>
        <div style={{ color: GRAY, fontSize: 40, fontFamily: "sans-serif" }}>
          and you have no idea 😬
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — the problem  (90–240, 5s)
// ══════════════════════════════════════════════════════════════════════════════
const ProblemItem: React.FC<{ emoji: string; text: string; idx: number; startFrame: number }> = ({
  emoji, text, idx, startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - startFrame - idx * 10, fps, config: { damping: 14, stiffness: 110 } });
  const x = interpolate(p, [0, 1], [-80, 0]);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${x}px)`, opacity: op }}>
      <span style={{ fontSize: 44 }}>{emoji}</span>
      <span style={{ color: WHITE, fontSize: 36, fontFamily: "sans-serif" }}>{text}</span>
    </div>
  );
};

const SceneProblem: React.FC = () => (
  <AbsoluteFill style={{ background: BG, padding: "80px 72px", justifyContent: "center" }}>
    <Fade start={0} dur={8}>
      <div style={{ color: GRAY, fontSize: 36, fontFamily: "sans-serif", marginBottom: 48 }}>
        most people are silently paying for...
      </div>
    </Fade>
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <ProblemItem emoji="🏋️" text="subscriptions they forgot about"  idx={0} startFrame={6} />
      <ProblemItem emoji="📺" text="streaming they cancelled (still charging)" idx={1} startFrame={6} />
      <ProblemItem emoji="🌐" text="internet at the wrong price"           idx={2} startFrame={6} />
      <ProblemItem emoji="📱" text="apps from 2022 auto-renewing"          idx={3} startFrame={6} />
      <ProblemItem emoji="🔁" text="duplicate services"                    idx={4} startFrame={6} />
    </div>
  </AbsoluteFill>
);

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — product intro  (240–390, 5s)
// ══════════════════════════════════════════════════════════════════════════════
const SceneProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoPop = spring({ frame, fps, config: { damping: 10, stiffness: 70 } });
  const logoScale = interpolate(logoPop, [0, 1], [0.5, 1]);
  const logoOp = interpolate(logoPop, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #052e16 0%, ${BG} 60%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 72px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${logoScale})`,
          opacity: logoOp,
        }}
      >
        {/* logo mark */}
        <div
          style={{
            width: 120,
            height: 120,
            background: `linear-gradient(135deg, ${GREEN_DK}, ${GREEN})`,
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            fontSize: 64,
            boxShadow: `0 0 60px rgba(34,197,94,0.5)`,
          }}
        >
          💰
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 80,
            fontFamily: "sans-serif",
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          costra
        </div>
        <div style={{ color: GREEN, fontSize: 36, fontFamily: "sans-serif", marginTop: 12 }}>
          AI savings concierge
        </div>
      </div>

      <Fade start={30}>
        <div
          style={{
            marginTop: 56,
            color: GRAY,
            fontSize: 38,
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          upload your bills.
          <br />
          <span style={{ color: WHITE }}>find money you're already losing.</span>
        </div>
      </Fade>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — demo / results  (390–630, 8s)
// ══════════════════════════════════════════════════════════════════════════════
const ResultRow: React.FC<{
  label: string; sub: string; amount: string; saving: string; idx: number; startFrame: number;
}> = ({ label, sub, amount, saving, idx, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - startFrame - idx * 8, fps, config: { damping: 14, stiffness: 100 } });
  const y = interpolate(p, [0, 1], [50, 0]);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: "24px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transform: `translateY(${y}px)`,
        opacity: op,
      }}
    >
      <div>
        <div style={{ color: WHITE, fontSize: 30, fontFamily: "sans-serif", fontWeight: 600 }}>{label}</div>
        <div style={{ color: GRAY, fontSize: 24, fontFamily: "sans-serif", marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ color: RED, fontSize: 28, fontFamily: "monospace", textDecoration: "line-through" }}>{amount}</div>
        <div style={{ color: GREEN, fontSize: 26, fontFamily: "sans-serif", fontWeight: 700 }}>{saving}</div>
      </div>
    </div>
  );
};

const SceneResults: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // counter animation for total
  const counterProgress = spring({ frame: frame - 140, fps, config: { damping: 16, stiffness: 60 } });
  const total = Math.round(interpolate(counterProgress, [0, 1], [0, 94]));

  return (
    <AbsoluteFill style={{ background: BG, padding: "60px 56px" }}>
      <Fade start={0} dur={6}>
        <div style={{ color: WHITE, fontSize: 40, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 28 }}>
          here's what costra found 👇
        </div>
      </Fade>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ResultRow label="Planet Fitness" sub="never been in 4 months" amount="$24.99/mo" saving="cancel → save $300/yr" idx={0} startFrame={6} />
        <ResultRow label="Adobe Creative" sub="free alternative exists" amount="$54.99/mo" saving="switch → save $660/yr" idx={1} startFrame={6} />
        <ResultRow label="Hulu (cancelled?)" sub="still auto-charging" amount="$17.99/mo" saving="cancel → save $216/yr" idx={2} startFrame={6} />
        <ResultRow label="Internet plan" sub="same speed, better promo" amount="$89/mo" saving="switch → save −$20/mo" idx={3} startFrame={6} />
      </div>

      {/* running total */}
      <Fade start={130} dur={10}>
        <div
          style={{
            marginTop: 28,
            background: `linear-gradient(135deg, ${GREEN_DK}, ${GREEN})`,
            borderRadius: 20,
            padding: "28px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 0 40px rgba(34,197,94,0.3)",
          }}
        >
          <div style={{ color: WHITE, fontSize: 34, fontFamily: "sans-serif", fontWeight: 700 }}>
            monthly savings found
          </div>
          <div style={{ color: WHITE, fontSize: 56, fontFamily: "sans-serif", fontWeight: 900 }}>
            ${total}/mo
          </div>
        </div>
      </Fade>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 5 — CTA  (630–900, 9s)
// ══════════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 70 } });
  const scale = interpolate(pop, [0, 1], [0.85, 1]);

  // subtle bounce on CTA button
  const btnBounce = 1 + 0.025 * Math.sin((frame / 15) * Math.PI);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 70% at 50% 80%, rgba(34,197,94,0.15) 0%, ${BG} 65%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 72px",
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{ fontSize: 90, marginBottom: 28, filter: "drop-shadow(0 0 40px rgba(34,197,94,0.6))" }}>
          🔍
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 64,
            fontFamily: "sans-serif",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 16,
            letterSpacing: "-1px",
          }}
        >
          how much are
          <br />
          <span style={{ color: GREEN }}>you</span> losing?
        </div>

        <Fade start={20}>
          <div style={{ color: GRAY, fontSize: 34, fontFamily: "sans-serif", marginBottom: 48, lineHeight: 1.5 }}>
            upload 1 bill. takes 2 minutes.
            <br />it's free.
          </div>
        </Fade>

        <Fade start={30}>
          <div
            style={{
              background: GREEN,
              borderRadius: 100,
              padding: "32px 72px",
              color: "#000",
              fontSize: 46,
              fontFamily: "sans-serif",
              fontWeight: 900,
              display: "inline-block",
              transform: `scale(${btnBounce})`,
              boxShadow: "0 8px 40px rgba(34,197,94,0.4)",
              letterSpacing: "-0.5px",
            }}
          >
            find my savings →
          </div>
        </Fade>

        <Fade start={40}>
          <div style={{ color: GRAY, fontSize: 30, fontFamily: "sans-serif", marginTop: 32 }}>
            costra.ai · link in bio
          </div>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT COMPOSITION  — 30s @ 30fps = 900 frames
// ══════════════════════════════════════════════════════════════════════════════
export const CostraTikTok: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0}   durationInFrames={90}>  <SceneHook />    </Sequence>
    <Sequence from={90}  durationInFrames={150}> <SceneProblem /> </Sequence>
    <Sequence from={240} durationInFrames={150}> <SceneProduct /> </Sequence>
    <Sequence from={390} durationInFrames={240}> <SceneResults /> </Sequence>
    <Sequence from={630} durationInFrames={270}> <SceneCTA />     </Sequence>
  </AbsoluteFill>
);
