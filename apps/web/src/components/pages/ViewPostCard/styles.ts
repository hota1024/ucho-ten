import { tv } from "@nextui-org/react";

export const viewPostCard = tv({
    slots: {
        PostCard:'w-full min-w-[350px] border-b-[1px]',
            PostCardContainer: 'pl-[8px] pt-[11px] pb-[24px] w-full',
            PostAuthor: 'w-[100%-16px] h-[28px] items-center flex relative select-none',
                PostAuthorIcon: 'h-[28px] w-[28px] rounded-[10px] object-cover overflow-hidden',
                PostAuthorDisplayName:'ml-[9px] ',
                PostAuthorHandle: 'text-[#909090] font-light',
                PostCreatedAt: 'text-[#B8B8B8] font-light absolute right-[17px] ',
                OptionButton: 'text-[#B8B8B8] font-light absolute right-[17px]',
            PostContent: 'w-[100%-5px] h-full ml-[25px] mr-[17px] ',
            PostContentText: '',
            PostReactionButtonContainer: 'w-full h-[20px] text-right right-[17px] ',
            PostReactionButton: 'h-[16px] pl-[8px] pr-[8px] ml-[60px] text-[#909090] text-[12px] cursor-pointer select-none',
        dropdown: '',
        skeletonIcon: 'h-full w-full',
        skeletonName: 'h-3 w-2/5 rounded-lg ',
        skeletonHandle: 'h-3 w-3/5 rounded-lg ',
        skeletonTime: '',
        skeletonText1line: 'h-3 w-3/5 rounded-lg ',
        skeletonText2line: 'h-3 w-4/5 rounded-lg ',

    },
    variants: {
        color:{
            light: {
                PostCard: 'bg-white',
            },
            dark: {
                PostCard: 'bg-[#2C2C2C] text-[#D7D7D7] border-[#181818]',
                PostAuthorDisplayName: 'text-white',
                PostAuthorHandle: 'text-[#BABABA]',
                PostCreatedAt: 'text-[#B8B8B8]',
                dropdown: 'dark text-white',
                skeletonIcon: 'dark text-white',
                skeletonName: 'dark text-white',
                skeletonHandle: 'dark text-white',
                skeletonText1line: 'dark text-white',
                skeletonText2line: 'dark text-white',
            },
        },
        isMobile: {
            true: {
                PostModal: "rounded-none",
                background: "",
                PostContent: 'text-[14px] mb-[6px]',
            },
            false: {
                PostModal: "rounded-[10px] overflow-hidden min-h-[400px]",
                background: "relative flex justify-center items-center",
                PostContent: 'text-base mb-[6px]',
            },
        },
    }
});