import { Accordion, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getSubredditRules } from "../../../utils";
import { markdown } from "snudown-js";

function SubredditRules({ subreddit }) {
  const [rules, setRules] = useState(null);

  useEffect(() => {
    try {
      getSubredditRules(subreddit.display_name).then((data) => {
        setRules(data.rules);
      });
    } catch (error) {
      console.log(error);
    }
  }, [subreddit]);

  if (!rules) {
    return null;
  }

  return (
    <>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem 0" }}>
        {subreddit.display_name_prefixed} rules
      </Title>
      <Accordion
        styles={{
          label: { fontSize: 14 },
          chevron: { marginLeft: 0 },
        }}
      >
        {rules.map((rule, i) => {
          const createMarkup = (text) => {
            return { __html: markdown(text, { target: "_blank" }) };
          };
          return (
            <Accordion.Item value={rule.short_name} key={rule.short_name}>
              <Accordion.Control>
                <Text weight="bold">{`${i + 1}. ${rule.short_name}`}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {
                  <div
                    dangerouslySetInnerHTML={createMarkup(rule.description)}
                  />
                }
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}

export default SubredditRules;
