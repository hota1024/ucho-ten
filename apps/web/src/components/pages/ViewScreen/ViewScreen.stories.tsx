import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { ViewScreen } from "./ViewScreen";

const meta = {
    title: "Pages/ViewScreen",
    component: ViewScreen,
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
} satisfies Meta<typeof ViewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof ViewScreen> = (props:any) => {
    return <ViewScreen {...props} />
}

export const Default = Template.bind({})