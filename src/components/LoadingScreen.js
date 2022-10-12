import { Loader } from "@mantine/core";

function LoadingScreen() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </div>
  );
}

export default LoadingScreen;
