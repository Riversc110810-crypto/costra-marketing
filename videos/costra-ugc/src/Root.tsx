import React from "react";
import { Composition } from "remotion";
import { CostraScroll } from "./CostraScroll";
import { CostraAudit } from "./CostraAudit";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CostraScroll"
        component={CostraScroll}
        durationInFrames={900} // 30s @ 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CostraAudit"
        component={CostraAudit}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
