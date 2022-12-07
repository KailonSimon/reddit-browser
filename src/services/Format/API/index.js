export const mergePages = (pages) => {
  const mergedPages = [];
  for (let i = 0; i < pages.length; i++) {
    mergedPages.push(
      ...pages[i].data.children.map((submission) => submission.data)
    );
  }
  return mergedPages;
};
