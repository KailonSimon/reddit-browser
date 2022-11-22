import { createStyles, Anchor, Loader } from "@mantine/core";
import Link from "next/link";
import SubredditSearch from "../SubredditSearch";
import NavigationDrawer from "./NavigationDrawer";
import SignInButton from "../Authentication/SignInButton";
import UserMenu from "../UserMenu";
import { getUserData } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  header: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[9] : "#fff",
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
  title: {
    [theme.fn.largerThan("md")]: {
      position: "absolute",
      left: 16,
    },
  },
  searchBar: {
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
    position: "absolute",
    right: 16,
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

function Navbar() {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const { data: userData, isLoading } = useQuery({
    queryKey: ["currentUserData", session],
    queryFn: () => getUserData(session.user.name),
    enabled: !!session,
  });
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
          {isLoading && session ? (
            <Loader size="xs" />
          ) : !!userData ? (
            <UserMenu user={userData.data} />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
