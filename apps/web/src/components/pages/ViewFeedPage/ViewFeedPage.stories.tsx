import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import {ViewFeedPage} from "./ViewFeedPage";

const meta = {
  title: "Pages/ViewFeedPage",
  component: ViewFeedPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
    isProfileMine: false,
  }
} satisfies Meta<typeof ViewFeedPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof ViewFeedPage> = (props:any) => {
  return <ViewFeedPage {...props} />
}

export const Default = Template.bind({})