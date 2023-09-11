import { tv } from "@nextui-org/react";

export const viewHeader = tv({
    slots: {
        background: 'w-[100svw] h-[100svh] flex justify-center',
        backgroundColor: 'w-full h-full bg-[#000000] bg-opacity-10 absolute',
        Header:'h-[100px] w-full min-w-[300px] max-w-[500px] text-white backdrop-blur-[1px] bg-black/40',
            HeaderContentTitleContainer: '',
            HeaderContentTitle: '',
            HeaderContent: 'w-full h-[100%-86px] max-h-[400px] relative flex items-center flex-wrap overflow-y-scroll',
        top: 'h-[73px] w-full flex justify-center items-center',
        bottom: 'h-[27px] relative bottom-0 font-bold align-start',
    },
    variants: {
        color:{
            light: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/light/sky_00421.jpg")]',
                footer: 'bg-[#DADADA]',
            },
            dark: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg")]',
                footer: 'bg-[#2C2C2C]',
            },
        },
        isMobile: {
            true: {
                PostModal: "rounded-none",
                background: "",
            },
            false: {
                PostModal: "rounded-[10px] overflow-hidden",
                background: "relative",
            },
        },
        page:{
            single:{
                bottom:'flex justify-center items-center',
                HeaderContentTitle: 'justify-center items-center',
            },
            profile:{
                bottom:'flex justify-end items-baseline',
                HeaderContentTitle: 'w-[20%] flex justify-center items-center',
            },
            home:{
                HeaderContentTitleContainer:'flex ml-[40px] overflow-hidden overflow-x-scroll',
                HeaderContentTitle: 'justify-center items-center pl-[15px] pr-[15px]',
            },
            post:{
                bottom:'flex justify-center items-center',
                HeaderContentTitle: 'w-[50%] flex justify-center items-center',
            },
            search:{
                bottom:'flex justify-center items-baseline',
                HeaderContentTitle: 'w-[33.3%] flex justify-center items-center',
            }
        },
        isNextPage:{
            true:{

            },
            false:{

            }
        },

    }
});