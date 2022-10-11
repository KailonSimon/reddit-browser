import { Group, Image, Text } from "@mantine/core";
import { forwardRef } from "react";

function AutoCompleteItem({ value, title, image, ...others }, ref) {
  return (
    <div ref={ref} key={value} {...others}>
      <Group noWrap>
        {image && (
          <Image src={image} alt={value} height={30} width={30} fit="contain" />
        )}
        <div>
          <Text>{value}</Text>
          {value !== title && (
            <Text size="xs" color="dimmed">
              {title}
            </Text>
          )}
        </div>
      </Group>
    </div>
  );
}

export default forwardRef(AutoCompleteItem);
