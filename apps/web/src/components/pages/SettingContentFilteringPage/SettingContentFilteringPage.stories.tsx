import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { SettingContentFilteringPage } from "./SettingContentFilteringPage";

const meta = {
  title: "Pages/SettingContentFilteringPage",
  component: SettingContentFilteringPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
  }
} satisfies Meta<typeof SettingContentFilteringPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof SettingContentFilteringPage> = (props:any) => {
  return <SettingContentFilteringPage {...props} />
}

export const Default = Template.bind({})