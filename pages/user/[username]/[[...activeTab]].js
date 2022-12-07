import React from "react";
import Layout from "../../../src/components/Layout";
import { getCurrentUserData, getUserData } from "../../../utils";
import { wrapper } from "../../../store/store";
import { useSelector } from "react-redux";
import { selectDemoUser } from "../../../store/DemoUserSlice";
import Head from "next/head";
import ProfileFeed from "../../../src/components/User/ProfileFeed";
import UserCard from "../../../src/components/User/UserCard";
import { getToken } from "next-auth/jwt";

function User({ user, currentUser }) {
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
      <Layout currentUser={currentUser}>
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
            {false && user.name === demoUser.name ? (
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
  (store) =>
    async ({ req, query }) => {
      const { username } = query;
      const token = await getToken({ req });

      let user;
      let currentUser;
      if (token) {
        currentUser = (await getCurrentUserData(token.accessToken)).data;
        if (token.name === username) {
          user = currentUser;
        } else {
          user = (await getUserData(username, token.accessToken)).data;
        }
      } else {
        if (username === "DemoUser") {
          user = store.getState().demoUser;
        } else {
          user = (await getUserData(username)).data;
        }
      }

      return {
        props: { user, currentUser: currentUser || store.getState().demoUser },
      };
    }
);
