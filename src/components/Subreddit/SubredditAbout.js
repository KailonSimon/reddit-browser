import React from "react";
import Image from "next/image";
import { Divider, Text, Title } from "@mantine/core";
import { Cake } from "tabler-icons-react";
import { getDate } from "src/services/Format/Date";
import { condenseNumber, createMarkup } from "src/services/Format/API";

function SubredditAbout({ subreddit, variant = "full" }) {
  if (variant === "hover") {
    return (
      <div
        style={{
          maxWidth: "100%",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          display: "flex",
          flexDirection: "column",
          height: "min-content",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 6,
          }}
        >
          <Image
            src={subreddit.community_icon || subreddit.icon_img}
            alt={subreddit.title}
            height={36}
            width={36}
            style={{
              background: subreddit.primary_color || "transparent",
              borderRadius: "100%",
            }}
          />
          <Text>{subreddit.display_name_prefixed}</Text>
        </div>
        <div style={{ display: "flex", paddingTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "2rem",
            }}
          >
            <Text color="white" size={16} sx={{ lineHeight: 0.75 }}>
              {condenseNumber(subreddit.subscribers)}
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
              }}
            >
              {condenseNumber(subreddit.active_user_count)}
            </Text>
            <Text color="dimmed" size={12}>
              Online
            </Text>
          </div>
        </div>
        <Text size="xs" mt={8}>
          {subreddit.public_description}
        </Text>
      </div>
    );
  }
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
            {condenseNumber(subreddit.subscribers)}
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
            {condenseNumber(subreddit.active_user_count)}
          </Text>
          <Text color="dimmed" size={12}>
            Online
          </Text>
        </div>
      </div>
    </>
  );
}

export default SubredditAbout;
