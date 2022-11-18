import React from "react";
import { createStyles, Divider, Text, Title } from "@mantine/core";
import numeral from "numeral";
import { getDate } from "../../utils";

const useStyles = createStyles((theme) => ({
  container: {
    height: "min-content",
    width: "20rem",
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    position: "relative",
    borderRadius: "4px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    marginLeft: "1.5rem",

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));
function SubredditSidebar({ subreddit }) {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <Title color="dimmed" order={2} size={14} mb={12}>
        About community
      </Title>
      <Text color="white">{subreddit.public_description}</Text>
      <Text color="dimmed">Created {getDate(subreddit.created)}</Text>
      <Divider mb="sm" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "50%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text color="white" size={16} sx={{ lineHeight: 0.75 }}>
            {numeral(subreddit.subscribers).format("0.[0]a")}
          </Text>
          <Text color="dimmed" size={12}>
            Members
          </Text>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text
            color="white"
            size={16}
            sx={{
              lineHeight: 0.75,
              ":before": { content: '"●"', marginRight: 4, color: "#46d160" },
            }}
          >
            {numeral(subreddit.active_user_count).format("0.[0]a")}
          </Text>
          <Text color="dimmed" size={12}>
            Online
          </Text>
        </div>
      </div>
    </div>
  );
}

export default SubredditSidebar;
