"use client";

import dynamic from "next/dynamic";

const FaultyTerminal = dynamic(() => import("@/components/faulty-terminal"), {
  ssr: false,
  loading: () => null,
});

export function TerminalBackground() {
  return (
    <div className="absolute inset-0 z-[100]" style={{ pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
        <FaultyTerminal
          scale={2.3}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.2}
          pause={false}
          scanlineIntensity={0.3}
          glitchAmount={0.8}
          flickerAmount={0.6}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#10b981"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={true}
          brightness={0.9}
        />
      </div>
    </div>
  );
}

