import React from "react";
import SubredditBanner from "../../../../src/components/SubredditBanner";
import Layout from "../../../../src/components/Layout";
import { getSubredditInfo, getSubredditWikiPage } from "../../../../utils";
import { markdown } from "snudown-js";
import { createStyles, Divider, Text } from "@mantine/core";
import SubredditSidebar from "../../../../src/components/SubredditSidebar";
import { getRelativeTime } from "../../../../utils";
import SubredditRules from "../../../../src/components/Subreddit/SubredditRules";
import SidebarContainer from "../../../../src/components/Navigation/SidebarContainer";

const useStyles = createStyles((theme) => ({
  content: {
    height: "min-content",
    width: 700,
    maxWidth: "100vw",
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
          gap: "1.5rem",
        }}
      >
        <SidebarContainer>
          <SubredditSidebar subreddit={subreddit} />
          <SubredditRules subreddit={subreddit} />
        </SidebarContainer>

        <div className={classes.content}>
          {wikiPage ? (
            <>
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
            </>
          ) : (
            <Text align="center">Error loading page</Text>
          )}
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
      wikiPage: wikiPageInfo.data || null,
    },
  };
}
