import { useState, useEffect } from "react";
import { Loader, Select } from "@mantine/core";
import { BrandReddit } from "tabler-icons-react";
import AutoCompleteItem from "./AutoCompleteItem";
import { fetchSubreddits } from "../../utils";
import { useRouter } from "next/router";

function SubredditSearch() {
  const [subreddits, setSubreddits] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubredditChange = (subreddit) => {
    if (subreddit) {
      router.push(`${window.location.origin}/sub/${subreddit}`);
    }
  };

  useEffect(() => {
    if (!searchValue) {
      return;
    }
    if (searchValue.trim().length === 0) {
      setLoading(false);
    } else {
      setLoading(true);
      fetchSubreddits(searchValue)
        .then((data) => {
          if (!data?.data?.children?.length) {
            setLoading(false);
            return;
          } else {
            setSubreddits(
              data.data.children.map((subreddit) => {
                return {
                  label: `/r/${subreddit.data.display_name}`,
                  value: subreddit.data.display_name,
                  title: subreddit.data.title,
                  image: subreddit.data.icon_img,
                };
              })
            );
          }
        })
        .finally(() => setLoading(false));
    }
  }, [searchValue]);
  return (
    <Select
      searchable
      clearable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onChange={handleSubredditChange}
      data={subreddits}
      icon={<BrandReddit />}
      spellCheck={false}
      placeholder={"Search subreddits..."}
      itemComponent={AutoCompleteItem}
      rightSection={loading ? <Loader size={16} /> : null}
      filter={(value, item) => {
        return (
          item.title.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        );
      }}
      styles={(theme) => ({
        root: {
          minWidth: 400,
        },
        input: {
          border: `1px solid ${
            theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
          }`,
          background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
        },
      })}
    />
  );
}

export default SubredditSearch;
