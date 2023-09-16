import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import {ViewSideBar} from "./ViewSideBar";

const meta = {
  title: "Pages/ViewSideBar",
  component: ViewSideBar,
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
} satisfies Meta<typeof ViewSideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof ViewSideBar> = (props:any) => {
  return <ViewSideBar {...props} />
}

export const Default = Template.bind({})