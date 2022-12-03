import React, { useEffect, useState, useRef } from "react";
import parse from "html-react-parser";
import { Loader } from "@mantine/core";

function Video({ type, content }) {
  const [pathname, setPathname] = useState("");
  function createMarkup() {
    return { __html: content };
  }
  const videoRef = useRef(null);
  useEffect(() => {
    setPathname(window.location.pathname.split("/")[1]);
  }, []);

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
  if (pathname === "post") {
    return (
      <div
        className="videoWrapper"
        style={{
          marginTop: 8,
          maxHeight: "calc(100vh - 16rem)",
          background: "#000",
        }}
        dangerouslySetInnerHTML={{ __html: parse(content) }}
      />
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
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
}

export default Video;
