import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { SearchTabtPage } from "./SearchTabtPage";

const meta = {
  title: "Pages/SearchTabtPage",
  component: SearchTabtPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args:{
    className: "",
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
  }
} satisfies Meta<typeof SearchTabtPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof SearchTabtPage> = (props:any) => {
  return <SearchTabtPage {...props} />
}

export const Default = Template.bind({})