import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        background: 'w-full h-full max-w-[500px]',
        backgroundColor: 'w-full h-full bg-[#000000] bg-opacity-10 absolute',
        SearchBar: 'bg-white h-[54px] w-full flex items-center justify-center',
        SearchBarInputArea: 'h-[44px] w-full bg-[#E9E9E9] ml-[12px] mr-[12px] placeholder-[#7D7D7D] outline-none pl-[20px] pr-[40px]',
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
    }
});