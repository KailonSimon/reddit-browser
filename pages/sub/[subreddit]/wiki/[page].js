import React, { useEffect } from "react";
import SubredditBanner from "../../../../src/components/SubredditBanner";
import Layout from "../../../../src/components/Layout";
import { getSubredditInfo, getSubredditWikiPage } from "../../../../utils";
import { markdown } from "snudown-js";
import { createStyles, Divider, Text } from "@mantine/core";
import SubredditSidebar from "../../../../src/components/SubredditSidebar";
import { getRelativeTime } from "../../../../utils";

const useStyles = createStyles((theme) => ({
  container: {
    height: "min-content",
    maxWidth: 700,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    position: "relative",
    borderRadius: "4px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    color: theme.colorScheme === "dark" ? "#fff" : "#000",
  },
}));

function WikiPage({ subreddit, wikiPage }) {
  const { classes } = useStyles();

  function createMarkup() {
    return { __html: markdown(wikiPage.content_md, { target: "_blank" }) };
  }
  return (
    <Layout>
      <SubredditBanner subreddit={subreddit} />
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          width: "100%",
          padding: "0 1rem",
        }}
      >
        <SubredditSidebar subreddit={subreddit} />
        <div className={classes.container}>
          <div dangerouslySetInnerHTML={createMarkup()} />
          {wikiPage.revision_by ? (
            <>
              <Divider mt="lg" />{" "}
              <Text size={14} color="dimmed">
                Last revised by {wikiPage.revision_by.data.name} -{" "}
                {getRelativeTime(wikiPage.revision_by.data.created)}
              </Text>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export default WikiPage;

export async function getServerSideProps(context) {
  const { subreddit, page } = context.query;
  const subredditInfo = await getSubredditInfo(subreddit);
  const wikiPageInfo = await getSubredditWikiPage(subreddit, page);

  return {
    props: {
      subreddit: subredditInfo.data,
      wikiPage: wikiPageInfo.data,
    },
  };
}
