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
        background: theme.colorScheme === "dark" ? theme.black : theme.white,
      })}
    >
      <Loader />
    </Box>
  );
}

export default LoadingScreen;
