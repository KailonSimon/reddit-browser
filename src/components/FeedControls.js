import { useEffect, useReducer, useState } from "react";
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

const initialState = { loading: false, data: [], searchValue: "", value: "" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_SEARCH_VALUE":
      return { ...state, searchValue: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    default:
      return initialState;
  }
}

function FeedControls({
  subreddit,
  setSubreddit,
  sorting,
  setSorting,
  isRefetching,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setSubreddit(state.value);
  }, [state.value]);

  useEffect(() => {
    dispatch({ type: "SET_DATA", payload: [] });
    if (!state.searchValue) {
      return;
    }
    if (state.searchValue.trim().length === 0) {
      dispatch({ type: "SET_LOADING", payload: false });
    } else {
      dispatch({ type: "SET_LOADING", payload: true });
      fetch(
        `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${state.searchValue}&include_profiles=false&limit=3`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.data.children.length) {
            dispatch({ type: "SET_LOADING", payload: false });
          }
          dispatch({
            type: "SET_DATA",
            payload: data.data.children.map((subreddit) => {
              return {
                label: `/r/${subreddit.data.display_name}`,
                value: subreddit.data.display_name,
                title: subreddit.data.title,
                image: subreddit.data.icon_img,
              };
            }),
          });
        })
        .finally(() => dispatch({ type: "SET_LOADING", payload: false }));
    }
  }, [state.searchValue]);
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
        searchValue={state.searchValue}
        clearable
        data={state.data}
        limit={3}
        onChange={(e) => dispatch({ type: "SET_VALUE", payload: e })}
        onSearchChange={(e) =>
          dispatch({ type: "SET_SEARCH_VALUE", payload: e })
        }
        rightSection={
          state.loading || isRefetching ? <Loader size={16} /> : null
        }
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
          state.searchValue?.trim().length &&
          !state.loading && <Text>No matching subreddits</Text>
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
