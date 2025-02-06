import React from "react";

const HumanBody: React.FC = () => {
  return (
    <div style={{ width: "500px", height: "400px" }}>
      <object
        type="image/svg+xml"
        data="/Silhouette_of_a_woman.svg"
        width="100%"
        height="100%"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        Your browser does not support SVG.
      </object>
    </div>
  );
};

export default HumanBody;
