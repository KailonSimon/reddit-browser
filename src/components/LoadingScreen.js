import { Box, Loader } from "@mantine/core";

function LoadingScreen() {
  return (
    <Box
      sx={(theme) => ({
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#030303",
      })}
    >
      <Loader color="#59ba12" />
    </Box>
  );
}

export default LoadingScreen;
