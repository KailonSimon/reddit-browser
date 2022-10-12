import { Anchor, createStyles, Title } from "@mantine/core";
import Link from "next/link";

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
      <Link href="/" passHref>
        <Anchor
          align="center"
          mb={8}
          sx={{ fontFamily: "Chillax" }}
          color="brand"
          variant="text"
          size={24}
        >
          Reddit<span>B</span>rowser
        </Anchor>
      </Link>
      {children}
    </div>
  );
}

export default Layout;
