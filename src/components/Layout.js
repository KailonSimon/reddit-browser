import { Anchor, createStyles, Button, Affix, Transition } from "@mantine/core";
import { ArrowUp } from "tabler-icons-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

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
      padding: "1rem 1rem",
    },
  },
}));

function Layout({ children }) {
  const { classes } = useStyles();
  const [scrollPosition, setScrollPosition] = useState(0);
  const ref = useRef();
  const router = useRouter();

  return (
    <>
      <div
        className={classes.container}
        onScroll={() => setScrollPosition(ref.current?.scrollTop)}
        ref={ref}
      >
        <Link href="/" passHref>
          <Anchor
            align="center"
            mb={8}
            sx={{ fontFamily: "Chillax" }}
            color="brand"
            variant="text"
            size={24}
            weight={700}
          >
            Reddit<span>B</span>rowser
          </Anchor>
        </Link>
        {children}
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
