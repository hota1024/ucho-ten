import { tv } from "@nextui-org/react";

export const viewSideBar = tv({
    slots: {
        background: 'w-[70svw] min-w-[210px] max-w-[350px] h-[100svh] select-none ',
        AuthorIconContainer: 'h-[20%] w-full border-b-[1px] border-[#E3E3E3] pl-[18px] pb-[18px] pt-[80px] bg-white bg-opacity-40 flex items-center',
        AuthorDisplayName: 'font-black font-[16px]',
        AuthorHandle: '',
        Content: 'h-[60%] w-full pl-[18px] pt-[24px] pb-[24px] bg-white bg-opacity-40',
            NavBarIcon: 'h-[28px] w-[28px] mr-[17px]',
            NavBarItem: 'h-[28px] w-full mb-[20px] flex items-center font-bold cursor-pointer',
        Footer: 'h-[20%] w-full pl-[18px] pt-[24px] border-t-[1px] border-[#E3E3E3] pb-[75px] bg-white bg-opacity-40',

    },
    variants: {
        color:{
            light: {
                footer: 'bg-[#DADADA]',
                AuthorHandle: 'text-[#767676]',
            },
            dark: {
                footer: 'bg-[#2C2C2C]',
                AuthorHandle: 'text-[#D7D7D7]',
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