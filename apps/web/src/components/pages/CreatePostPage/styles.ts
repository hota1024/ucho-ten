import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        background: 'w-[100svw] h-[100svh]',
        backgroundColor: 'w-full h-full bg-[#000000] bg-opacity-10 absolute',

        PostModal: 'w-full min-w-[300px] max-w-[500px] height-full max-h-[750px] shadow-xl position-absolute top-0 left-0 right-0 bottom-0 m-auto fontFamily-[Noto Sans JP] relative',
        header: 'w-full h-[43px] top-0 relative select-none',
            headerCancelButton: 'w-[91px] h-[37px] left-[4px] bottom-[3px] absolute text-white',
            headerTitle: 'w-full h-full text-center text-base font-medium fontSize-[16px] items-center flex justify-center',
            headerPostButton: 'w-[91px] h-[37px] right-[8px] bottom-[3px] absolute ',

        content: 'w-full h-[100%-86px] max-h-[400px] relative flex items-center flex-wrap overflow-y-scroll',
            contentLeft: 'w-[54px] h-full absolute flex flex-col items-center select-none',
                contentLeftAuthorIcon: 'w-[30px] h-[30px] absolute mt-0 bg-black rounded-[10px] overflow-hidden cursor-pointer',
                contentLeftAuthorIconImage: 'w-full h-full drag-none',
            contentRight: 'w-[calc(100%-54px)] h-[200px] relative ml-[54px]',
                contentRightContainer: 'w-full',
                contentRightTextArea: 'w-[calc(100%-12px)] h-[200px] bg-transparent resize-none outline-none placeholder-[#808080] bg-transparent resize-none outline-none] overflow-visible',
                contentRightImagesContainer: 'w-[100%] h-[105px] whitespace-nowrap flex flex-wrap flex-col b-0',
                contentRightUrlsContainer: 'w-[100%] h-[40px] whitespace-nowrap flex flex-wrap flex-col',
                    contentRightUrlCard: 'w-full',
                    contentRightUrlCardDeleteButton: 'w-[calc(100%-485px)] bg-red bg-opacity-10 rounded-[10px] cursor-pointer',
        URLCard: 'h-full w-[485px] rounded-[10px] overflow-hidden border-[1px] border-[#808080] bg-[#FFFFFF] flex items-center cursor-pointer',
        URLCardThumbnail: 'h-[100px] w-[100px] border-[1px] border-[#808080] border-r-0',
        URLCardDetail: 'flex h-full w-[calc(100%-110px)] align-center ml-[10px]',
        URLCardDetailContent:'h-full w-[370px] min-w-[0px]',
        URLCardTitle: 'font-bold whitespace-nowrap overflow-hidden text-ellipsis',
        URLCardDescription: 'font-gray mt-[1px] ',
        URLCardLink: 'font-gray mt-[1px] text-[#0000FF]',


        footer: 'w-full h-[43px] absolute bottom-0 select-none ',
            footerTooltip: 'h-full w-full flex justify-left items-left',
            footerTooltipStyle:'h-[20px] relative ml-7　mt-3 cursor-pointer',
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
                PostModal: "rounded-[10px] overflow-hidden min-h-[400px]",
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
        urlCardAvailable : {
            true: {
                contentRightContainer: 'h-[calc(100%-100px)]',
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