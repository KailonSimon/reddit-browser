import { createStyles, Image, Text, Title } from "@mantine/core";
import moment from "moment";
import React, { useEffect } from "react";
import Layout from "../../src/components/Layout";
import { useSession } from "next-auth/react";
import { getUserData } from "../../utils";
import { wrapper } from "../../store/store";
import { useSelector } from "react-redux";
import { selectAuthentication } from "../../store/AuthSlice";
import { selectDemoUser } from "../../store/DemoUserSlice";

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
  const authentication = useSelector(selectAuthentication);
  const demoUser = useSelector(selectDemoUser);

  return (
    <Layout>
      {!user ? (
        <div>Error: User not found</div>
      ) : (
        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
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
                {(session && session.user.name == user.name) ||
                (authentication.status === "demo" &&
                  user.name === demoUser.name)
                  ? " (you)"
                  : ""}
              </Title>
              <Text size="xs" color="dimmed">
                Member since {moment.unix(user.created).format("MMMM Do, YYYY")}{" "}
                ({moment.unix(user.created).fromNow()})
              </Text>
              <Text>Post Karma: {user.link_karma}</Text>
              <Text>Comment Karma: {user.comment_karma}</Text>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default User;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { username } = context.query;
    const user = await getUserData(username);
    const demoUser = store.getState().demoUser;

    if (username === "demoUserID") {
      return { props: { user: demoUser } };
    } else {
      return {
        props: { user: user.data || null },
      };
    }
  }
);
