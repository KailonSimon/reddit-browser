import React from "react";
import { createStyles, Image, Text, Title } from "@mantine/core";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectAuthentication } from "../../../store/AuthSlice";
import { selectDemoUser } from "../../../store/DemoUserSlice";

const useStyles = createStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    maxWidth: "20rem",
    color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    borderRadius: 4,
    padding: "1rem",
    background: "linear-gradient(to bottom, #59ba12 4rem, #1A1A1B 50px)",
  },
}));

function UserCard({ user }) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const authentication = useSelector(selectAuthentication);
  const demoUser = useSelector(selectDemoUser);

  return (
    <div className={classes.card}>
      <Image
        src={
          user.snoovatar_img ||
          "https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png"
        }
        height={100}
        width={100}
        alt={`${user.name}'s snoovatar`}
        classNames={{ image: classes.image }}
        radius={8}
        fit="contain"
        mr={16}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Title
          order={1}
          size={22}
          variant="text"
          align="center"
          weight={500}
          mt={4}
          mb={4}
        >
          {user.name}
          {(session && session.user.name == user.name) ||
          (authentication.status === "demo" && user.name === demoUser.name)
            ? " (you)"
            : ""}
        </Title>
        <Text size="xs" color="dimmed">
          Member since {moment.unix(user.created).format("MMMM Do, YYYY")} (
          {moment.unix(user.created).fromNow()})
        </Text>
        <Text>Post Karma: {user.link_karma}</Text>
        <Text>Comment Karma: {user.comment_karma}</Text>
      </div>
    </div>
  );
}

export default UserCard;
