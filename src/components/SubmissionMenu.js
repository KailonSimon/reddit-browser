import { Menu, ActionIcon } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { ClipboardCopy, Dots, Link } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";

export default function SubmissionMenu({ type, submission }) {
  const clipboard = useClipboard({ timeout: 500 });

  const handleCopy = (text) => {
    const maxLength = 20;
    clipboard.copy(text);
    showNotification({
      title: "Copied successfully!",
      message: `You copied: ${
        text.length > maxLength ? text.substr(0, maxLength) + "..." : text
      }`,
    });
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon>
          <Dots color="#818384" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <>
          {type == "post" ? (
            <>
              <Menu.Item
                icon={<ClipboardCopy />}
                onClick={() => handleCopy(submission.title)}
              >
                Copy Title
              </Menu.Item>
            </>
          ) : (
            <Menu.Item
              icon={<ClipboardCopy />}
              onClick={() => handleCopy(submission.body)}
            >
              Copy Text
            </Menu.Item>
          )}
          <Menu.Item
            icon={<Link />}
            onClick={() =>
              handleCopy(`${window.location.origin}/${type}/${submission.id}`)
            }
          >
            Copy Link
          </Menu.Item>
        </>
      </Menu.Dropdown>
    </Menu>
  );
}
