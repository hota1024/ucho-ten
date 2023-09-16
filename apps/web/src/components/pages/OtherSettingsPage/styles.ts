import { tv } from "@nextui-org/react";

export const otherSettingsPage = tv({
    slots: {
        background: 'w-[100svw] min-w-[350px] max-w-[500px] h-[100svh]',
        table :'',
        dropdown: '',

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
                dropdown: 'dark text-white',
            },
        },
        isMobile: {
            true: {
                background: "",
            },
            false: {
                background: "",
            },
        },
    }
});