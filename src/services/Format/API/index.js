import { markdown } from "snudown-js";
import numeral from "numeral";

export const mergePages = (pages) => {
  const mergedPages = [];
  for (let i = 0; i < pages.length; i++) {
    mergedPages.push(
      ...pages[i].data.children.map((submission) => submission.data)
    );
  }
  return mergedPages;
};

export const createMarkup = (text) => {
  return { __html: markdown(text, { target: "_blank" }) };
};

export const condenseNumber = (number) => {
  return numeral(number).format("0.[0]a");
};
