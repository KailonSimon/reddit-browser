import React, { useRef } from "react";
import parse from "html-react-parser";

function Video({ type, content }) {
  const videoRef = useRef(null);
  if (type === "hosted") {
    return (
      <video
        width="100%"
        height="auto"
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ marginTop: 8 }}
      >
        <source src={content} type="video/mp4" />
      </video>
    );
  }
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
