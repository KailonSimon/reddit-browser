import { Fragment, useEffect, useState } from "react";
import {
  Button,
  createStyles,
  Loader,
  MultiSelect,
  Select,
  Text,
  Title,
} from "@mantine/core";
import PostTile from "../src/components/PostTile";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BrandReddit } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  container: {
    padding: "0 0.5rem",
    [theme.fn.largerThan("xs")]: {
      padding: "0 1rem",
    },
  },
  posts: {
    display: "flex",
    flexDirection: "column",
    [theme.fn.largerThan("sm")]: {
      gap: 8,
    },
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const [subreddits, setSubreddits] = useState([
    "LearnProgramming",
    "ProgrammerHumor",
    "WebDev",
    "WorldNews",
    "Futurology",
    "Science",
  ]);
  const [sorting, setSorting] = useState("hot");

  const fetchPosts = async ({ pageParam = "" }) => {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddits.join(
        "+"
      )}/${sorting}.json?limit=25&after=${pageParam}`
    );
    return res.json();
  };

  const {
    status,
    data,
    error,
    refetch,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(["posts"], fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.after;
    },
  });

  useEffect(() => {
    refetch();
  }, [subreddits, sorting]);

  return status === "loading" ? (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </div>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      <div
        className={classes.container}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "1rem 0",
            width: "100%",
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Title
            align="center"
            mb={16}
            sx={{ fontFamily: "Chillax" }}
            color="brand"
          >
            Reddit<span>B</span>rowser
          </Title>

          <div
            style={{
              marginBottom: "16px",
              background: "#1A1A1B",
              width: "100%",
              border: "1px solid #474748",
              borderRadius: 4,
              padding: "1rem",
            }}
          >
            <MultiSelect
              label={
                <Text color="#D7DADC" mb={4}>
                  Select Subreddits
                </Text>
              }
              clearable={false}
              value={subreddits}
              onChange={setSubreddits}
              data={[
                {
                  value: "LearnProgramming",
                  label: "Learn Programming",
                  group: "Programming",
                },
                {
                  value: "WebDev",
                  label: "Web Development",
                  group: "Programming",
                },
                {
                  value: "ProgrammerHumor",
                  label: "Programmer Humor",
                  group: "Programming",
                },
                { value: "WorldNews", label: "World News", group: "News" },
                { value: "Science", label: "Science", group: "News" },
                { value: "Futurology", label: "Futurology", group: "News" },
                { value: "NFL", label: "NFL", group: "Sports" },
                { value: "NBA", label: "NBA", group: "Sports" },
                { value: "Soccer", label: "Soccer", group: "Sports" },
              ]}
              searchable
              nothingFound="No matching subreddits"
              variant="default"
              disabled={isRefetching}
              icon={<BrandReddit />}
            />
            <Select
              label={
                <Text color="#D7DADC" mb={4}>
                  Sort By
                </Text>
              }
              value={sorting}
              onChange={setSorting}
              data={[
                { value: "hot", label: "Hot" },
                { value: "best", label: "Best" },
                { value: "top", label: "Top" },
                { value: "new", label: "New" },
                { value: "rising", label: "Rising" },
                { value: "controversial", label: "Controversial" },
              ]}
              variant="default"
              disabled={isRefetching}
            />
          </div>

          <div className={classes.posts}>
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.children.map((post) => (
                  <PostTile key={post.data.id} post={post.data} />
                ))}
              </Fragment>
            ))}
            <Button
              my={8}
              onClick={fetchNextPage}
              disabled={!hasNextPage}
              style={{ width: 250, alignSelf: "center" }}
              size="lg"
              loading={isFetchingNextPage}
            >
              {hasNextPage
                ? isFetchingNextPage
                  ? "Loading More..."
                  : "Load More"
                : "Nothing more to load"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
