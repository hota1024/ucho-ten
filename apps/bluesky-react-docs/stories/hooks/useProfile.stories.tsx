import type { Meta, StoryObj } from "@storybook/react";
import { provideBlueskyContext } from "../../decorators/provideBlueskyContext";
import { useProfile } from "bluesky-react";
import { CodeView } from "../../components/CodeView";

const meta = {
  title: "hooks/useProfile",
  decorators: [
    (Story) => provideBlueskyContext(<Story />, { requiredAuth: true }),
  ],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Demo: Story = {
  args: {},
  render() {
    const { profile: profile1 } = useProfile({ actor: "hota1024.com" });
    const { profile: profile2 } = useProfile({ actor: "1024.works" });

    console.log("story");

    return (
      <div>
        <CodeView>{JSON.stringify(profile1, null, 2)}</CodeView>
        <CodeView>{JSON.stringify(profile2, null, 2)}</CodeView>
      </div>
    );
  },
};
