import { useEffect, useState } from "react";
import {
  Box,
  Center,
  Loader,
  SegmentedControl,
  Select,
  Text,
} from "@mantine/core";

import {
  BrandReddit,
  EggCracked,
  Flame,
  Medal,
  TrendingUp,
} from "tabler-icons-react";

import AutoCompleteItem from "./AutoCompleteItem";

function FeedControls({
  subreddit,
  setSubreddit,
  sorting,
  setSorting,
  isRefetching,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    setSubreddit(value);
  }, [value, setSubreddit]);

  useEffect(() => {
    setData([]);
    if (!searchValue) {
      return;
    }
    if (searchValue.trim().length === 0) {
      setLoading(false);
    } else {
      setLoading(true);
      fetch(
        `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${searchValue}&include_profiles=false&limit=3`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.data.children.length) {
            setLoading(false);
          }
          setData(
            data.data.children.map((subreddit) => {
              return {
                label: `/r/${subreddit.data.display_name}`,
                value: subreddit.data.display_name,
                title: subreddit.data.title,
                image: subreddit.data.icon_img,
              };
            })
          );
        })
        .finally(() => setLoading(false));
    }
  }, [searchValue, setData, setLoading]);
  return (
    <div
      style={{
        marginBottom: "16px",
        background: "#1A1A1B",
        width: 600,
        maxWidth: "100%",
        border: "1px solid #474748",
        borderRadius: 4,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <Select
        searchable
        searchValue={searchValue}
        clearable
        data={data}
        limit={3}
        onChange={setValue}
        onSearchChange={setSearchValue}
        rightSection={loading || isRefetching ? <Loader size={16} /> : null}
        label="Search"
        placeholder={"Search subreddits..."}
        itemComponent={AutoCompleteItem}
        spellCheck={false}
        icon={<BrandReddit />}
        filter={(value, item) => {
          return (
            item.title.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.value.toLowerCase().includes(value.toLowerCase().trim())
          );
        }}
        nothingFound={
          searchValue?.trim().length &&
          !loading && <Text>No matching subreddits</Text>
        }
        disabled={isRefetching}
      />
      <SegmentedControl
        fullWidth
        color="brand"
        radius={4}
        label={
          <Text color="#D7DADC" mb={4}>
            Sort By
          </Text>
        }
        value={sorting}
        onChange={setSorting}
        data={[
          {
            value: "hot",
            label: (
              <Center>
                <Flame size={16} />
                <Box ml={6}>Hot</Box>
              </Center>
            ),
          },
          {
            value: "top",
            label: (
              <Center>
                <Medal size={16} />
                <Box ml={6}>Top</Box>
              </Center>
            ),
          },
          {
            value: "new",
            label: (
              <Center>
                <EggCracked size={16} />
                <Box ml={6}>New</Box>
              </Center>
            ),
          },
          {
            value: "rising",
            label: (
              <Center>
                <TrendingUp size={16} />
                <Box ml={6}>Rising</Box>
              </Center>
            ),
          },
        ]}
        variant="default"
        disabled={isRefetching}
      />
    </div>
  );
}

export default FeedControls;
