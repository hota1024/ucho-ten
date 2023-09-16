import { tv } from "@nextui-org/react";

export const viewHeader = tv({
    slots: {
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
                footer: 'bg-[#DADADA]',
            },
            dark: {
                footer: 'bg-[#2C2C2C]',
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