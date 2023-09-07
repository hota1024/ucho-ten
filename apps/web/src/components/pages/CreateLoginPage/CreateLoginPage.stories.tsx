import { ComponentStory } from '@storybook/react'
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserView, MobileView, isMobile } from "react-device-detect"


import { CreateLoginPage } from "./CreateLoginPage";

const meta = {
    title: "Pages/CreateLoginPage",
    component: CreateLoginPage,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof CreateLoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: ComponentStory<typeof CreateLoginPage> = (props:any) => {
    return <CreateLoginPage {...props} />
}

export const Default = Template.bind({})