import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

export const getRelativeTime = (timestamp) => {
  return dayjs.unix(timestamp).fromNow();
};

export const getDate = (timestamp) => {
  return dayjs.unix(timestamp).format("MMMM D, YYYY");
};

export const getCondensedDate = (timestamp) => {
  return dayjs.unix(timestamp).format("MM/DD/YYYY");
};
