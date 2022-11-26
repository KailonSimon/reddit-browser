import React from "react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    height: "min-content",
    minHeight: "120px",
    width: "20rem",
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "0 0.75rem 0.75rem",
    display: "flex",
    flexDirection: "column",

    position: "relative",
    borderRadius: "4px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
  },
}));
function InfoCard({ children }) {
  const { classes } = useStyles();
  return <div className={classes.container}>{children}</div>;
}

export default InfoCard;
