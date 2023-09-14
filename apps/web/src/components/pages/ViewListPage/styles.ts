import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        background: 'w-full h-full max-w-[500px]',
        SearchBar: 'bg-white h-[54px] w-full flex items-center justify-center relative',
        SearchBarInputArea: 'h-[44px] w-full bg-[#E9E9E9] ml-[12px] mr-[12px] placeholder-[#7D7D7D] outline-none pl-[20px] pr-[40px] rounded-[10px]',
        SearchButton: 'absolute right-[12px] text-[#818181]',
        Label: 'w-full h-[40px] border-t-[1px] border-b-[1px] pl-[26px] flex items-center',
        ListItem: '',
        AccordionItemContent: 'h-[54px] w-full flex items-center border-b pl-[17px] ',
    },
    variants: {
        color:{
            light: {
                background: 'text-black bg-white',
                ListItem: '',
                SearchBar: 'bg-white',
                AccordionItemContent: '',
            },
            dark: {
                background: 'text-white bg-black',
                SearchBar: 'bg-black',
                SearchBarInputArea: 'bg-[#1C1C1C] placeholder-[#7D7D7D] border-[#181818]',
                ListItem: 'text-white',
                Label: 'border-[#1C1C1C] text-white',
                AccordionItemContent: 'border-[#1C1C1C]',
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