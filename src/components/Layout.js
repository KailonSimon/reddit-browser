import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createStyles, Button, Affix, Transition } from "@mantine/core";
import { ArrowUp } from "tabler-icons-react";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("../components/Navigation/Navbar"));

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    height: "100%",
    minHeight: "100vh",
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor:
      theme.colorScheme === "dark" ? "#030303" : theme.colors.gray[2],
  },
}));

function Layout({ currentUser, children }) {
  const { classes } = useStyles();
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className={classes.container}>
        <main
          style={{
            width: "100%",
          }}
        >
          {children}
        </main>
      </div>
      <Affix
        position={{ bottom: 20 }}
        sx={(theme) => ({
          width: "calc(100vw - 2rem)",
          display: "flex",
          justifyContent: "center",
          zIndex: 50,

          [theme.fn.smallerThan("md")]: {
            width: "calc(100vw - 1rem)",
          },
        })}
      >
        <Transition
          transition="slide-up"
          mounted={scrollPosition > 0 && !router.query.post}
        >
          {(transitionStyles) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                leftIcon={<ArrowUp size={16} />}
                style={transitionStyles}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Scroll to top
              </Button>
            </div>
          )}
        </Transition>
      </Affix>
    </>
  );
}

export default Layout;
