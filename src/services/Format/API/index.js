import { markdown } from "snudown-js";
import numeral from "numeral";

export const mergePages = (pages) => {
  return pages.flatMap(({ data: { children } }) =>
    children.map((submission) => submission.data)
  );
};

export const createMarkup = (text) => {
  return { __html: markdown(text, { target: "_blank" }) };
};

export const condenseNumber = (number) => {
  return numeral(number).format("0.[0]a");
};
