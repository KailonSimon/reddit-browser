import { createStyles, Image, Loader, Text, Title } from "@mantine/core";
import moment from "moment";
import React from "react";
import Layout from "../../src/components/Layout";
import { useSession } from "next-auth/react";
import { getUserData } from "../../utils";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    width: "100%",
    maxWidth: 600,
    color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    borderRadius: 4,
    padding: "1rem",
  },
  image: {
    background: `#59ba12ff`,
    padding: 8,
  },
}));

function User({ user }) {
  const { classes } = useStyles();
  const { data: session } = useSession();

  return (
    <Layout>
      {!user ? (
        <div>Error: user not found</div>
      ) : (
        <div className={classes.container}>
          <Image
            src={
              user.data.snoovatar_img ||
              "https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png"
            }
            height={100}
            width={100}
            alt={`${user.data.name}'s snoovatar`}
            classNames={{ image: classes.image }}
            radius={8}
            fit="contain"
            mr={16}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Title order={2} variant="text" sx={{ fontFamily: "Chillax" }}>
              {user.data.name}
              {session && session.user.name == user.data.name && " (you)"}
            </Title>
            <Text size="xs" color="dimmed">
              Member since{" "}
              {moment.unix(user.data.created).format("MMMM Do, YYYY")} (
              {moment.unix(user.data.created).fromNow()})
            </Text>
            <Text>Post Karma: {user.data.link_karma}</Text>
            <Text>Comment Karma: {user.data.comment_karma}</Text>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default User;
export async function getServerSideProps(context) {
  const { username } = context.query;
  const user = await getUserData(username);

  return {
    props: { user },
  };
}
