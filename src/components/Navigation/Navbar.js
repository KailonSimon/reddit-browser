import { createStyles, Text } from "@mantine/core";
import Link from "next/link";
import SubredditSearch from "./SearchBar";
import NavigationDrawer from "./NavigationDrawer";
import UserMenu from "../User/UserMenu";
import { useSelector } from "react-redux";
import { selectDemoUser } from "src/store/DemoUserSlice";
import ErrorBoundary from "../ErrorBoundary";

const useStyles = createStyles((theme) => ({
  header: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    letterSpacing: 1.5,
    padding: "0 1rem",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
    }`,
  },
  nav: {
    height: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    position: "relative",

    [theme.fn.smallerThan("md")]: {
      justifyContent: "center",
    },
  },
  searchBar: {
    flex: 1,
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
  drawer: {
    position: "absolute",
    right: 16,
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
  userControls: {
    maxHeight: 42,
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

function Navbar({ currentUser }) {
  const { classes } = useStyles();
  const demoUser = useSelector(selectDemoUser);

  return (
    <ErrorBoundary>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <Link href="/" passHref>
            <Text
              color="brand"
              size={24}
              weight={700}
              className={classes.title}
            >
              Reddit<span>B</span>rowser
            </Text>
          </Link>
          <div
            style={{
              position: "relative",
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1.5rem",
              paddingLeft: "1rem",
            }}
          >
            <div className={classes.searchBar}>
              <SubredditSearch />
            </div>

            <div className={classes.drawer}>
              <NavigationDrawer user={currentUser} />
            </div>
            <div className={classes.userControls}>
              <UserMenu user={currentUser} />
            </div>
          </div>
        </nav>
      </header>
    </ErrorBoundary>
  );
}

export default Navbar;
