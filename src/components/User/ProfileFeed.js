import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectDemoUser } from "src/store/DemoUserSlice";
import UserCard from "./UserCard";
import Feed from "../Feed/Feed";
import { Tabs, createStyles, Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  userCardContainer: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
  tabsList: {
    paddingLeft: "0.5rem",
    height: 40,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    [theme.fn.smallerThan("md")]: {
      padding: 0,
      display: "flex",
      justifyContent: "space-around",
    },
  },
  tabPanel: {
    padding: "0 1rem",
    display: "flex",
    gap: "1.5rem",
  },
  tab: {
    [theme.fn.smallerThan("md")]: { padding: "10px 8px" },
  },
  tabLabel: {
    border: "1px solid red",
    fontWeight: 500,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    marginTop: "1rem",

    [theme.fn.largerThan("md")]: { flex: 1, textAlign: "left" },
  },
}));

function ProfileFeed({ user }) {
  const { classes } = useStyles();
  const {
    savedSubmissions,
    upvotedSubmissions,
    downvotedSubmissions,
    hiddenSubmissions,
  } = useSelector(selectDemoUser);

  const tabs = [
    { title: "saved", content: savedSubmissions },
    { title: "upvoted", content: upvotedSubmissions },
    { title: "downvoted", content: downvotedSubmissions },
    { title: "hidden", content: hiddenSubmissions },
  ];
  const router = useRouter();

  return (
    <Tabs
      styles={(theme) => ({
        root: { flex: 1 },
        tabLabel: { fontWeight: 500 },
      })}
      defaultValue="saved"
      onTabChange={(value) =>
        router.push(`/user/${user.name}/${value}`, null, { shallow: true })
      }
    >
      <Tabs.List className={classes.tabsList}>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.title} value={tab.title} className={classes.tab}>
            {tab.title.toUpperCase()}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Panel
          key={tab.title}
          value={tab.title}
          pt="xs"
          className={classes.tabPanel}
        >
          {tab.content.length ? (
            <Feed
              submissions={tab.content}
              hiddenShown={tab.title === "hidden"}
              variant="profile"
            />
          ) : (
            <Text className={classes.text}>
              {`hmm... looks like you haven't ${tab.title} anything yet`}
            </Text>
          )}
          <div className={classes.userCardContainer}>
            <UserCard user={user} />
          </div>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export default ProfileFeed;
