import { tv } from "@nextui-org/react";

export const settingContentFilteringPage = tv({
    slots: {
        background: 'w-[100svw] min-w-[350px] max-w-[500px] h-[100svh]',
        table :'',

    },
    variants: {
        color:{
            light: {
                background: 'bg-white',
                table: '',
            },
            dark: {
                background: 'bg-black',
                table: 'dark text-white',
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