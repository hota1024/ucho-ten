import type { Meta, StoryObj } from "@storybook/react";
import { BlueskyProvider } from "bluesky-react";

const meta = {
  title: "BlueskyProvider",
  component: BlueskyProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof BlueskyProvider>;

export default meta;
type Story = StoryObj<typeof BlueskyProvider>;

export const Demo: Story = {
  args: {
    service: "https://bsky.social",
  },
  render(props) {
    return (
      <BlueskyProvider {...props}>
        BlueskyProvider has BskyAgent of {props.service.toString()}
      </BlueskyProvider>
    );
  },
};
