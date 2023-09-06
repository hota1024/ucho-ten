import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        background: 'w-[100svw] h-[100svh]',
        backgroundColor: 'w-full h-full bg-[#000000] bg-opacity-10 absolute',

        PostModal: 'w-full min-w-[300px] max-w-[500px] height-full max-h-[750px] shadow-xl position-absolute top-0 left-0 right-0 bottom-0 m-auto fontFamily-[Noto Sans JP] ',
        header: 'w-full h-[43px] top-0 relative select-none',
            headerCancelButton: 'w-[91px] h-[37px] left-[4px] bottom-[3px] absolute',
            headerTitle: 'w-full h-full text-center text-base font-medium fontSize-[16px] items-center flex justify-center',
            headerPostButton: 'w-[91px] h-[37px] right-[4px] bottom-[3px] absolute ',

        content: 'w-full h-[40dvh] max-h-[400px] relative flex items-center flex-wrap',
            contentLeft: 'w-[54px] h-full relative flex flex-col items-center select-none',
                contentLeftAuthorIcon: 'w-[30px] h-[30px] relative bg-black rounded-[10px] overflow-hidden cursor-pointer',
                contentLeftAuthorIconImage: 'w-full h-full drag-none',
            contentRight: 'w-[calc(100%-54px)] h-full relative',
                contentRightContainer: 'w-full ',
                contentRightTextArea: 'w-[calc(100%-12px)] h-full relative bg-transparent resize-none outline-none placeholder-[#808080] bg-transparent resize-none outline-none]',
                contentRightImagesContainer: 'w-full h-[105px]　flex items-center',

        footer: 'w-full h-[43px] relative select-none',
            footerTooltip: 'h-full w-full flex justify-left items-left',
            footerTooltipStyle:'h-[20px] relative ml-7　mt-3',
            footerCharacterCount: 'h-full w-full flex justify-end items-center mr-5',
                footerCharacterCountText: 'text-[16px]',
                footerCharacterCountCircle: 'w-[20px] h-[20px] mr-[10px]',
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
            },
        },
        isMobile: {
            true: {
                PostModal: "rounded-none",
                background: "",
            },
            false: {
                PostModal: "rounded-[10px] overflow-hidden",
                background: "relative flex justify-center items-center",
            },
        },
        uploadImageAvailable : {
            true: {
                contentRightContainer: 'h-[calc(100%-105px)]',
            },
            false: {
                contentRightContainer: 'h-full',
            }
        },
        isDragActive: {
            true: {
                content: 'border-[2px] border-dashed border-[#000000]'
            },
            false: {
                content: 'border-none',
            }
        }
    }
});