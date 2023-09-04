import type { Meta, StoryObj } from "@storybook/react";

import { CreatePostPage } from "./CreatePostPage";

const meta = {
  title: "Pages/CreatePostPage",
  component: CreatePostPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CreatePostPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
