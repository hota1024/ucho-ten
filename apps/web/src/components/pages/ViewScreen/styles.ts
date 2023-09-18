import { tv } from "@nextui-org/react";

export const viewScreen = tv({
    slots: {
        background: 'w-[100svw] h-[100svh] justify-center items-center flex ',
        backgroundColor: 'w-full h-full bg-[#000000] bg-opacity-10 absolute',
        tabbar: '',
    },
    variants: {
        color:{
            light: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/light/sky_00421.jpg")]',
                PostModal: 'bg-[#DADADA] bg-opacity-70 text-white',
                footer: 'bg-[#DADADA]',
            },
            dark: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg")]',
                PostModal: 'bg-[#2C2C2C] bg-opacity-70 text-[#D7D7D7]',
                footer: 'bg-[#2C2C2C]',
                dropdown: 'dark text-white',
                popover: 'dark text-white',
            },
        },
        isMobile: {
            true: {
            },
            false: {
            },
        },
    }
});