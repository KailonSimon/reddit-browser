import React from "react";
import Layout from "../../../src/components/Layout";
import { getUserData } from "../../../utils";
import { wrapper } from "../../../store/store";
import { useSelector } from "react-redux";
import { selectDemoUser } from "../../../store/DemoUserSlice";
import Head from "next/head";
import ProfileFeed from "../../../src/components/User/ProfileFeed";
import UserCard from "../../../src/components/User/UserCard";

function User({ user }) {
  const demoUser = useSelector(selectDemoUser);

  return (
    <>
      <Head>
        {user ? (
          <>
            <title>{user.name}</title>
            <meta property="og:title" content={`${user.name}'s profile`} />
          </>
        ) : (
          <title>User not found</title>
        )}
      </Head>
      <Layout>
        {!user ? (
          <div>Error: User not found</div>
        ) : (
          <div
            style={{
              marginTop: "4rem",
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            {user.name === demoUser.name ? (
              <ProfileFeed user={user} />
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <UserCard user={user} />
              </div>
            )}
          </div>
        )}
      </Layout>
    </>
  );
}

export default User;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { username } = context.query;
    const user = await getUserData(username);
    const demoUser = store.getState().demoUser;

    if (username === "DemoUser") {
      return { props: { user: demoUser } };
    } else {
      return {
        props: { user: user.data || null },
      };
    }
  }
);
