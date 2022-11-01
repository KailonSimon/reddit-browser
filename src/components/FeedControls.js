import { Box, Center, SegmentedControl, Text } from "@mantine/core";

import { EggCracked, Flame, Medal, TrendingUp } from "tabler-icons-react";

function FeedControls({ sorting, setSorting, isRefetching }) {
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
