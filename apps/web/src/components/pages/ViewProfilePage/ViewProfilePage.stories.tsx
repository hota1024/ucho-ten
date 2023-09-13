import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { ViewProfilePage } from "./ViewProfilePage";

const meta = {
  title: "Pages/ViewProfilePage",
  component: ViewProfilePage,
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
} satisfies Meta<typeof ViewProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof ViewProfilePage> = (props:any) => {
  return <ViewProfilePage {...props} />
}

export const Default = Template.bind({})