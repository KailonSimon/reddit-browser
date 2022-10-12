import React from "react";
import parse from "html-react-parser";

function Video({ content }) {
  return (
    <div className="videoWrapper" style={{ marginTop: 8 }}>
      <div
        dangerouslySetInnerHTML={{
          __html: parse(content),
        }}
      />
    </div>
  );
}

export default Video;
