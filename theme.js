export const theme = {
  colorScheme: "dark",
  fontFamily: "Albert Sans, sans-serif",
  colors: {
    brand: [
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
      "#59ba12ff",
    ],
    accent: [
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
      "#7312ba",
    ],
  },
  primaryColor: "brand",
  globalStyles: (theme) => ({
    a: {
      color: theme.colors.brand,
      ":hover": {
        textDecoration: "underline",
      },
    },
    p: { margin: 0 },
    "p + p": {
      marginTop: 8,
    },
    "nav > a": { ":hover": { textDecoration: "none" } },
    h1: {
      marginTop: 0,
    },
    h2: {
      marginTop: 0,
    },
    h3: {
      marginTop: 0,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      captionSide: "top",
      color: "#C1C2C5",
      lineHeight: 1.55,
      fontSize: 14,
      [theme.fn.smallerThan("xs")]: {
        fontSize: 11,
      },
    },
    th: {
      borderBottom: "1px solid #373A40",
      textAlign: "left",
      fontWeight: "bold",
      padding: "7px 10px",
      [theme.fn.smallerThan("xs")]: {
        padding: "2px",
      },
    },
    thead: {
      borderBottom: "1px solid #373A40",
      textAlign: "left",
      fontWeight: "bold",
      padding: "7px 10px",
      [theme.fn.smallerThan("xs")]: {
        padding: "2px",
      },
    },
    tr: {
      borderBottom: "1px solid #373A40",
      textAlign: "left",
      fontWeight: "bold",
      padding: "7px 10px",
      [theme.fn.smallerThan("xs")]: {
        padding: "2px",
      },
    },
    td: {
      padding: "7px 10px",
      borderBottom: "1px solid #373A40",
      [theme.fn.smallerThan("xs")]: {
        padding: "2px",
      },
    },
    ".mantine-Accordion-content > div > ul": {
      padding: 0,
      listStyle: "none",
    },
    ".mantine-Accordion-content": {
      padding: "0 0.75rem 1rem",
    },
    ".mantine-Accordion-control": {
      padding: "0.5rem",
    },
  }),
};
