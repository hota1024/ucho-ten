import { tv } from "@nextui-org/react";

export const postOnlyPage = tv({
    slots: {
        Container: 'h-full min-w-[350px] max-w-[500px]',
        AuthorPost: 'w-full border-b-[1px] border-[#AAAAAA]',
        Author: 'flex items-center pt-[10px] pl-[14px] pr-[24px] pb-[9px]',
        AuthorIcon: 'bg-[#D9D9D9] h-[50px] w-[50px] rounded-[10px] mr-[12px]',
        AuthorDisplayName: 'text-[16px]',
        AuthorHandle: 'text-[12px]',
        PostContent: 'pl-[26px] pt-[6px] pr-[24px] pb-[20px] w-full',
        PostCreatedAt: 'pl-[14px] text-[#AAAAAA] text-[12px]',
        ReactionButtonContainer: 'mt-[16px] pl-[40px] pr-[40px] mb-[16px] flex justify-between ',
        ReactionButton: 'text-[20px] text-[#AAAAAA] cursor-pointer',
        dropdown: '',


    },
    variants: {
        color:{
            light: {
                Container: 'bg-white text-black',
                PostContent: 'text-black',
                PostCreatedAt: 'text-black',
            },
            dark: {
                Container: 'bg-black text-white',
                PostContent: 'text-white',
                PostCreatedAt: 'text-white',
                dropdown: 'dark text-white',
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