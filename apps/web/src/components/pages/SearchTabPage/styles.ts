import { tv } from "@nextui-org/react";

export const searchTabPage = tv({
    slots: {
        background: 'w-[100svw] flex',
        Container: 'min-w-[350px] max-w-[500px] w-full h-full text-white relative',
        RecommendContainer: 'fixed bottom-[50px]',
        FeedCard: 'w-full h-[75px] bg-white border-t-[0.5px] border-b-[0.5px] flex items-center',
        FeedCardIcon: 'h-[50px] w-[50px] bg-[#D9D9D9] rounded-[10px] ml-[40px] mr-[10px]',
        FeedTitle: 'font-bold text-[16px]',
        FeedCreator: 'text-[12px]',
    },
    variants: {
        color:{
            light: {
                FeedCard: 'bg-white border-[#969696]',
                FeedTitle: 'text-black',
                FeedCreator: 'text-[#BABABA]'
            },
            dark: {
                footer: 'bg-[#2C2C2C]',
                FeedCard: 'bg-black border-[#181818]',
                FeedTitle: 'text-white',
                FeedCreator: 'text-[#7D7D7D]'
            },
        },
        isMobile: {
            true: {
            },
            false: {
            },
        }
    }
});