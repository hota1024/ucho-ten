import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        Container: "w-96 h-96 relative",
        Header: "w-96 h-11 left-0 top-0 absolute",
        HeaderTitle: "w-9 left-[177.46px] top-[11px] absolute text-white text-base font-bold ",
        HeaderPostButton: "w-24 h-9 right-[4px] top-[3px] absolute",
        Content: 'w-96 h-80 left-0 top-[43px] absolute',
        ContentTextArea: "w-full h-full left-0 top-0 absolute text-black font-medium bg-transparent resize-none outline-none",
        ContentImagesContainer: "Footer w-96 h-28 left-0 top-[233px] absolute",
        Footer: "w-96 h-96 left-0 top-0 absolute",
        FooterBackgroundColor: "w-96 h-14 left-0 top-[381px] absolute bg-zinc-300",
        PostModal: 'fontFamily-[Noto Sans JP] w-full max-w-[500px] height-full max-h-[750px] position-[relative] bg-[#DADADA] bg-opacity-70 relative',
        header: 'w-full h-[43px] top-0 relative select-none',
            headerTitle: 'w-full h-full text-center text-white text-base font-medium fontSize-[16px] items-center flex justify-center',
            headerPostButton: 'w-[91px] h-[37px] right-[4px] top-[3px] absolute',

        content: 'w-full h-[400px] relative flex items-center flex-wrap',
            contentLeft: 'w-[54px] h-full relative flex flex-col items-center',
                contentLeftAuthorIcon: 'w-[30px] h-[30px] relative bg-black rounded-[10px]',
            contentRight: 'w-[calc(100%-54px)] h-full relative',
                contentRightTextArea: 'w-full h-full relative bg-transparent resize-none outline-none placeholder-[#808080]',
                contentRightImagesContainer: 'w-full h-[105px]　flex items-center',

        footer: 'w-full h-[43px] bottom-0 relative bg-[#DADADA] relative select-none',
            footerTooltip: 'h-full w-full flex justify-left items-left text-white',
            footerTooltipStyle:'h-[20px] relative ml-10　mt-3',
            footerCharacterCount: 'h-full w-full flex justify-end items-center text-white mr-10',
                footerCharacterCountText: 'text-[20px]',
                footerCharacterCountCircle: 'w-[20px] h-[20px] mr-[10px]',
    }
});