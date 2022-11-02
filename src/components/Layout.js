import { useState, useEffect } from "react";
import { createStyles, Button, Affix, Transition } from "@mantine/core";
import { ArrowUp } from "tabler-icons-react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    height: "100%",
    minHeight: "100vh",
    width: "100%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[9]
        : theme.colors.gray[2],
  },
}));

function Layout({ children }) {
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
      <Navbar />
      <div className={classes.container}>
        <main
          className={classes.contentWrapper}
          style={{
            maxWidth: "100vw",
            padding: "1rem 0.5rem",
            marginTop: "4rem",
          }}
        >
          {children}
        </main>
      </div>
      <Affix
        position={{ bottom: 20, right: 20 }}
        sx={{
          width: "calc(100vw - 32px)",
          display: "flex",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        <Transition
          transition="slide-up"
          mounted={scrollPosition > 0 && !router.query.post}
        >
          {(transitionStyles) => (
            <div
              style={{
                width: "100%",
                maxWidth: 1000,
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
