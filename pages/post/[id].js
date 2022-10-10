import {
  Anchor,
  Badge,
  Button,
  createStyles,
  Image,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { ArrowLeft } from "tabler-icons-react";
import Layout from "../../src/components/Layout";
import moment from "moment";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import CommentSection from "../../src/components/CommentSection";

const useStyles = createStyles((theme) => ({
  container: {
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.5rem",
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    margin: "0 0 4px",
  },
}));

function Post({ post }) {
  const { classes } = useStyles();

  return (
    <Layout>
      <div className={classes.container}>
        <Link href={"/"} passHref>
          <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
            Go to feed
          </Button>
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            color: "#D7DADC",
            border: "1px solid #474748",
            background: "#1A1A1B",
            borderRadius: 4,
          }}
        >
          <div className={classes.details}>
            <Text
              size="sm"
              weight="bold"
              component="a"
              href={`https://www.reddit.com/r/${post.subreddit}/`}
              target="_blank"
              rel="noreferrer"
              sx={(theme) => ({
                whiteSpace: "nowrap",
                ":hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: theme.colors.brand,
                },
              })}
            >
              r/{post.subreddit}
            </Text>
            <span style={{ margin: "0 4px", fontSize: 8 }}>•</span>
            <Text size="sm" sx={{ whiteSpace: "nowrap" }}>
              Posted by{" "}
              <Anchor
                href={`https://www.reddit.com/user/${post.author}`}
                target="_blank"
                rel="noreferrer"
                color="inherit"
                variant="text"
                sx={(theme) => ({
                  ":hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: theme.colors.accent,
                  },
                })}
              >
                u/{post.author}
              </Anchor>
            </Text>

            <Text size="sm" ml={4}>
              {moment.unix(post.created).fromNow()}
            </Text>
          </div>
          <Title
            order={1}
            style={{ fontSize: 20, fontFamily: "Chillax" }}
            variant="text"
          >
            {post.title}
          </Title>
          {post.link_flair_text && (
            <Badge
              variant="dot"
              size="md"
              mt={8}
              radius={4}
              sx={{ alignSelf: "flex-start" }}
            >
              {post.link_flair_text}
            </Badge>
          )}
          {!post.is_self &&
            (post.post_hint == "image" ? (
              <Image
                src={post.url}
                alt={post.title}
                styles={{ root: { marginTop: 8 } }}
              />
            ) : (
              <Anchor href={post.url} mt={4} size="sm">
                {parseUrl(post.url).hostname}
              </Anchor>
            ))}
          {post.selftext && <Text mt={4}>{post.selftext}</Text>}
        </div>
        <CommentSection postId={post.id} />
      </div>
    </Layout>
  );
}

export default Post;

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`https://www.reddit.com/api/info.json?id=t3_${id}`);
  const post = await res.json();

  return { props: { post: post.data.children[0].data } };
}
