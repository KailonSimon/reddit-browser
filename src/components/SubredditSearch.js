import { useReducer, useEffect } from "react";
import { Loader, Select } from "@mantine/core";
import AutoCompleteItem from "./AutoCompleteItem";
import { fetchSubreddits } from "../../utils";
import { useRouter } from "next/router";
import { BrandReddit, Search } from "tabler-icons-react";

const initialState = {
  isFocused: false,
  subreddits: [],
  searchValue: "",
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_IS_FOCUSED":
      return { ...state, isFocused: action.payload };
    case "SET_SUBREDDITS":
      return { ...state, subreddits: action.payload };
    case "SET_SEARCH_VALUE":
      return { ...state, searchValue: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return initialState;
  }
}

function SubredditSearch() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubredditChange = (subreddit) => {
    if (subreddit) {
      router.push(`${window.location.origin}/sub/${subreddit}`);
    }
  };

  useEffect(() => {
    if (!state.searchValue) {
      return;
    }
    if (state.searchValue.trim().length === 0) {
      dispatch({ type: "SET_LOADING", payload: false });
    } else {
      dispatch({ type: "SET_LOADING", payload: true });
      fetchSubreddits(state.searchValue)
        .then((data) => {
          if (!data?.data?.children?.length) {
            dispatch({ type: "SET_LOADING", payload: false });
            return;
          } else {
            dispatch({
              type: "SET_SUBREDDITS",
              payload: data.data.children.map((subreddit) => {
                return {
                  label: `/r/${subreddit.data.display_name}`,
                  value: subreddit.data.display_name,
                  title: subreddit.data.title,
                  image: subreddit.data.icon_img,
                };
              }),
            });
          }
        })
        .finally(() => dispatch({ type: "SET_LOADING", payload: false }));
    }
  }, [state.searchValue]);
  return (
    <Select
      searchable
      clearable
      searchValue={state.searchValue}
      onSearchChange={(value) =>
        dispatch({ type: "SET_SEARCH_VALUE", payload: value })
      }
      onChange={handleSubredditChange}
      data={state.subreddits}
      icon={state.isFocused ? <BrandReddit /> : <Search />}
      spellCheck={false}
      placeholder={
        router.query.subreddit
          ? `/r/${router.query.subreddit}`
          : "Search subreddits..."
      }
      itemComponent={AutoCompleteItem}
      rightSection={state.loading ? <Loader size={16} /> : null}
      size="md"
      filter={(value, item) => {
        return (
          item.title.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        );
      }}
      styles={(theme) => ({
        root: {
          [theme.fn.largerThan("md")]: {
            minWidth: 400,
          },
        },
        input: {
          border: `1px solid ${
            theme.colorScheme === "dark" ? "#474748" : theme.colors.dark[6]
          }`,
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
          borderRadius: 4,
          [theme.fn.largerThan("md")]: {
            borderRadius: 999,
          },
        },
        dropdown: {
          border: "1px solid #474748",
          borderRadius: 4,
          overflow: "hidden",
          filter: "drop-shadow(0 0.2rem 0.25rem #000)",
        },
      })}
      onFocus={() => dispatch({ type: "SET_IS_FOCUSED", payload: true })}
      onBlur={() => dispatch({ type: "SET_IS_FOCUSED", payload: false })}
    />
  );
}

export default SubredditSearch;
