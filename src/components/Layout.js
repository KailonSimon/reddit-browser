import { createStyles, Title } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    maxHeight: "100vh",
    overflow: "auto",
    padding: "1rem 0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    [theme.fn.largerThan("xs")]: {
      padding: "2rem 1rem",
    },
  },
}));

function Layout({ children }) {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <Title align="center" mb={8} sx={{ fontFamily: "Chillax" }} color="brand">
        Reddit<span>B</span>rowser
      </Title>
      {children}
    </div>
  );
}

export default Layout;
