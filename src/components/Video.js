import React, { useRef } from "react";
import parse from "html-react-parser";
import { Loader } from "@mantine/core";

function Video({ type, content }) {
  function createMarkup() {
    return { __html: content };
  }
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
        style={{ marginTop: 8, maxHeight: "calc(100vh - 16rem)" }}
      >
        <source src={content} type="video/mp4" />
      </video>
    );
  }
  return (
    <div
      className="videoWrapper"
      style={{ marginTop: 8, maxHeight: "calc(100vh - 16rem)" }}
    >
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
}

export default Video;
