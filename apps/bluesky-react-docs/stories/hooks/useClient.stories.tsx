import type { Meta, StoryObj } from "@storybook/react";
import { provideBlueskyContext } from "../../decorators/provideBlueskyContext";
import { useClient } from "bluesky-react";

const meta = {
  title: "hooks/useClient",
  decorators: [(Story) => provideBlueskyContext(<Story />)],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Demo: Story = {
  args: {},
  render() {
    const client = useClient();

    return <div>Current service is: {client.agent.service.toString()}</div>;
  },
};
