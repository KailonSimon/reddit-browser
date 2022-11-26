import React from "react";
import { Divider, Text, Title } from "@mantine/core";
import numeral from "numeral";
import { getDate } from "../../utils";
import { markdown } from "snudown-js";
import { Cake } from "tabler-icons-react";

function SubredditSidebar({ subreddit }) {
  const createMarkup = (text) => {
    return { __html: markdown(text, { target: "_blank" }) };
  };
  return (
    <>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem 0" }}>
        About community
      </Title>
      <Text color="white">
        <div
          dangerouslySetInnerHTML={createMarkup(subreddit.public_description)}
        />
      </Text>
      <Text color="dimmed" my={8}>
        <Cake style={{ position: "relative", top: 4 }} /> Created{" "}
        {getDate(subreddit.created)}
      </Text>
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
    </>
  );
}

export default SubredditSidebar;
