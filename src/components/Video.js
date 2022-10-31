import React, { useEffect, useRef } from "react";
import parse from "html-react-parser";
import { Loader } from "@mantine/core";

function Video({ type, content }) {
  useEffect(() => {
    console.log(content);
  }, [content]);
  const videoRef = useRef(null);
  if (!content) {
    return <Loader />;
  }
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
