import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { TabBar } from "./TabBar";

const meta = {
  title: "Pages/TabBar",
  component: TabBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
    uploadImageAvailable: false,
    selected: 'home',
  }
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof TabBar> = (props:any) => {
  return <TabBar {...props} />
}

export const Default = Template.bind({})