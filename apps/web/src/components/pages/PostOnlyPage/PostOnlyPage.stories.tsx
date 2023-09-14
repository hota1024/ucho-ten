import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { PostOnlyPage } from "./PostOnlyPage";

const meta = {
  title: "Pages/PostOnlyPage",
  component: PostOnlyPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
  }
} satisfies Meta<typeof PostOnlyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof PostOnlyPage> = (props:any) => {
  return <PostOnlyPage {...props} />
}

export const Default = Template.bind({})