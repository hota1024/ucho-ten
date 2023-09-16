import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { OtherSettingsPagePage } from "./OtherSettingsPagePage";

const meta = {
  title: "Pages/OtherSettingsPagePage",
  component: OtherSettingsPagePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
    isMobile: isMobile,
  }
} satisfies Meta<typeof OtherSettingsPagePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof OtherSettingsPagePage> = (props:any) => {
  return <OtherSettingsPagePage {...props} />
}

export const Default = Template.bind({})