import React from "react";

interface HumanBodyProps {
  taggedLocations: string[];
  botMessageContent: string;
}

const HumanBody: React.FC<HumanBodyProps> = ({ taggedLocations }) => {
  const highlightPositions = {
    chest: { x: 250, y: 120 },
    hands: [
      { x: 150, y: 200 },
      { x: 350, y: 200 }
    ],
    face: { x: 250, y: 50 },
    crotch: { x: 250, y: 230 },
    butt: { x: 250, y: 250 },
    leg: [
      { x: 200, y: 300 },
      { x: 300, y: 300 }
    ],
    foot: [
      { x: 200, y: 380 },
      { x: 300, y: 380 }
    ]
  };

  return (
    <div style={{ width: "500px", height: "400px" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 400"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {/* Base silhouette */}
        <image
          href="/Silhouette_of_a_woman.svg"
          width="100%"
          height="100%"
        />
        
        {/* Highlight areas */}
        {taggedLocations.includes('chest') && (
          <circle cx={highlightPositions.chest.x} cy={highlightPositions.chest.y} r="30" fill="rgba(255,0,0,0.3)" />
        )}
        {taggedLocations.includes('hands') && (
          <>
            <circle cx={highlightPositions.hands[0].x} cy={highlightPositions.hands[0].y} r="20" fill="rgba(255,0,0,0.3)" />
            <circle cx={highlightPositions.hands[1].x} cy={highlightPositions.hands[1].y} r="20" fill="rgba(255,0,0,0.3)" />
          </>
        )}
        {taggedLocations.includes('face') && (
          <circle cx={highlightPositions.face.x} cy={highlightPositions.face.y} r="25" fill="rgba(255,0,0,0.3)" />
        )}
        {taggedLocations.includes('crotch') && (
          <circle cx={highlightPositions.crotch.x} cy={highlightPositions.crotch.y} r="20" fill="rgba(255,0,0,0.3)" />
        )}
        {taggedLocations.includes('butt') && (
          <circle cx={highlightPositions.butt.x} cy={highlightPositions.butt.y} r="25" fill="rgba(255,0,0,0.3)" />
        )}
        {taggedLocations.includes('leg') && (
          <>
            <circle cx={highlightPositions.leg[0].x} cy={highlightPositions.leg[0].y} r="25" fill="rgba(255,0,0,0.3)" />
            <circle cx={highlightPositions.leg[1].x} cy={highlightPositions.leg[1].y} r="25" fill="rgba(255,0,0,0.3)" />
          </>
        )}
        {taggedLocations.includes('foot') && (
          <>
            <circle cx={highlightPositions.foot[0].x} cy={highlightPositions.foot[0].y} r="15" fill="rgba(255,0,0,0.3)" />
            <circle cx={highlightPositions.foot[1].x} cy={highlightPositions.foot[1].y} r="15" fill="rgba(255,0,0,0.3)" />
          </>
        )}
      </svg>
    </div>
  );
};

export default HumanBody;