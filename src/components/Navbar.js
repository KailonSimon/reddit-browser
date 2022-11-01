import React from "react";
import { createStyles, Anchor } from "@mantine/core";
import Link from "next/link";
import SubredditSearch from "./SubredditSearch";
import NavigationDrawer from "./NavigationDrawer";
import SignInButton from "./SignInButton";
import UserMenu from "./UserMenu";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  header: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: theme.colorScheme === "dark" ? "#121212" : "#fff",
    letterSpacing: 1.5,
    padding: "0 1rem",
    borderBottom:
      theme.colorScheme === "dark" ? "" : `1px solid ${theme.colors.gray[4]}`,
  },
  nav: {
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    position: "relative",
    [theme.fn.smallerThan("sm")]: {
      justifyContent: "center",
    },
  },
  title: {
    [theme.fn.largerThan("sm")]: {
      position: "absolute",
      left: 16,
    },
  },
  searchBar: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  drawer: {
    position: "absolute",
    right: 16,
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  userControls: {
    position: "absolute",
    right: 16,
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

function Navbar() {
  const { classes } = useStyles();
  const { data: session } = useSession();
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <Link href="/" passHref>
          <Anchor
            color="brand"
            variant="text"
            size={24}
            weight={700}
            className={classes.title}
          >
            Reddit<span>B</span>rowser
          </Anchor>
        </Link>
        <div className={classes.searchBar}>
          <SubredditSearch />
        </div>
        <div className={classes.drawer}>
          <NavigationDrawer />
        </div>
        <div className={classes.userControls}>
          {session ? (
            <UserMenu user={{ name: "tehehi", karma: "4.5" }} />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
