import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { CreatePostPage } from "./CreatePostPage";

const meta = {
  title: "Pages/CreatePostPage",
  component: CreatePostPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
    uploadImageAvailable: false,
  }
} satisfies Meta<typeof CreatePostPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof CreatePostPage> = (props:any) => {
  return <CreatePostPage {...props} />
}

export const Default = Template.bind({})