import { Anchor, createStyles, Button, Affix, Transition } from "@mantine/core";
import { ArrowUp } from "tabler-icons-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Layout({ children }) {
  const { classes } = useStyles();
  const [scrollPosition, setScrollPosition] = useState(0);
  const ref = useRef();
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div
        className={classes.container}
        onScroll={() => setScrollPosition(ref.current?.scrollTop)}
        ref={ref}
      >
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
                onClick={() =>
                  ref.current?.scrollTo({ top: 0, behavior: "smooth" })
                }
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
