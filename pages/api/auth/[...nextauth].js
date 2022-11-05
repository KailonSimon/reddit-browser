import NextAuth from "next-auth";
import RedditProvider from "next-auth/providers/reddit";

export const authOptions = {
  providers: [
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identity vote read",
          duration: "permanent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        console.log(token);
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
