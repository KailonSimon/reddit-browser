import { createStyles, Image, Text, Title } from "@mantine/core";
import moment from "moment";
import React from "react";
import Layout from "../../src/components/Layout";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    width: "100%",
    maxWidth: 600,
    color: "#D7DADC",
    border: "1px solid #474748",
    background: "#1A1A1B",
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
  return (
    <Layout>
      <div className={classes.container}>
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
          <Title order={2} variant="text" sx={{ fontFamily: "Chillax" }}>
            {user.name}
          </Title>
          <Text size="xs" color="dimmed">
            Member since {moment.unix(user.created).format("MMMM Do, YYYY")} (
            {moment.unix(user.created).fromNow()})
          </Text>
          <Text>Post Karma: {user.link_karma}</Text>
          <Text>Comment Karma: {user.comment_karma}</Text>
        </div>
      </div>
    </Layout>
  );
}

export default User;

export async function getServerSideProps(context) {
  const { username } = context.query;

  const res = await fetch(`https://www.reddit.com/user/${username}/about.json`);
  const data = await res.json();
  if (data.error === 404) {
    return {
      notFound: true,
    };
  }
  return { props: { user: data.data } };
}
