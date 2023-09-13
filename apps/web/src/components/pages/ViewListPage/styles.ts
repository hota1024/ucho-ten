import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        background: 'w-full h-full max-w-[500px]',
        SearchBar: 'bg-white h-[54px] w-full flex items-center justify-center relative',
        SearchBarInputArea: 'h-[44px] w-full bg-[#E9E9E9] ml-[12px] mr-[12px] placeholder-[#7D7D7D] outline-none pl-[20px] pr-[40px]',
        SearchButton: 'absolute right-[12px]',
        Label: 'w-full h-[40px] border-t-[1px] border-b-[1px] pl-[26px] flex items-center',
    },
    variants: {
        color:{
            light: {
                background: 'text-black',
            },
            dark: {
                background: 'text-white ',
                Label: 'border-[#181818]',
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