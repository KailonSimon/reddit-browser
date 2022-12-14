import React from "react";
import Head from "next/head";
import { getToken } from "next-auth/jwt";
import { useSession, signIn } from "next-auth/react";
import { useSelector } from "react-redux";
import { wrapper } from "src/store/store";
import { selectDemoUser } from "src/store/DemoUserSlice";
import Layout from "src/components/Layout";
import { ProfileFeed, UserCard } from "src/components/User";
import { getCurrentUserData, getUserData } from "src/services/User/server";

function User({ user, currentUser }) {
  const demoUser = useSelector(selectDemoUser);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn();
    }
  }, [session]);

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
