import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { ViewHeader } from "./ViewHeader";

const meta = {
    title: "Pages/ViewHeader",
    component: ViewHeader,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    args:{
        className: "",
        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
        isMobile: isMobile,
        page: "single",
        isNextPage: true,
    }
} satisfies Meta<typeof ViewHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof ViewHeader> = (props:any) => {
    return <ViewHeader {...props} />
}

export const Default = Template.bind({})