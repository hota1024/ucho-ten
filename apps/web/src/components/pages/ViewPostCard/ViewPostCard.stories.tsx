import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { ViewPostCard } from "./ViewPostCard";

const meta = {
  title: "Pages/ViewPostCard",
  component: ViewPostCard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
    uploadImageAvailable: false,
    numbersOfImage: 1,
  }
} satisfies Meta<typeof ViewPostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof ViewPostCard> = (props:any) => {
  return <ViewPostCard {...props} />
}

export const Default = Template.bind({})