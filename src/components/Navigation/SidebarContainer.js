import { Children } from "react";
import { createStyles } from "@mantine/core";
import InfoCard from "../InfoCard";

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
  const childrenArray = Children.toArray(children);

  return (
    <div className={classes.container}>
      {childrenArray.map((child, i) => {
        return <InfoCard key={i}>{child}</InfoCard>;
      })}
    </div>
  );
}

export default SidebarContainer;
