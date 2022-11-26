import React from "react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginLeft: "1.5rem",

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

function SidebarContainer({ children }) {
  const { classes } = useStyles();
  return <div className={classes.container}>{children}</div>;
}

export default SidebarContainer;
