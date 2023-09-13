import { tv } from "@nextui-org/react";

export const otherSettingsPage = tv({
    slots: {
        background: 'w-[100svw] h-[100svh]',
        table :'',

    },
    variants: {
        color:{
            light: {
                background: 'bg-white',
                table: 'bg-white',
            },
            dark: {
                background: 'bg-black',
                table: 'bg-black',
            },
        },
        isMobile: {
            true: {
                background: "",
            },
            false: {
                background: "relative flex justify-center items-center",
            },
        },
    }
});