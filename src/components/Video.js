import React, { useRef } from "react";
import { Loader } from "@mantine/core";

function Video({ type, content }) {
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
        style={{
          marginTop: 8,
          maxHeight: "calc(100vh - 16rem)",
          background: "#000",
        }}
      >
        <source src={content} type="video/mp4" />
      </video>
    );
  }
  return (
    <div
      className="videoWrapper"
      style={{
        marginTop: 8,
        maxHeight: "calc(100vh - 16rem)",
        background: "#000",
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default Video;
