import { tv } from "@nextui-org/react";

export const createLoginPage = tv({
    slots: {
        background: 'w-[100svw] h-[100svh] fontFamily-[Noto Sans JP] text-white flex justify-center items-center',
        LoginForm: 'w-80 h-72 left-0 top-0 relative',
            LoginFormConnectServer: 'w-full h-[54px] flex items-center bg-neutral-700 bg-opacity-50 rounded-lg',
                LoginFormConnectServerInputArea: '',
            LoginFormHandleInputArea: '',
        LoginFormHandle: 'h-[64px] w-full flex items-center mt-[10px] border-b-[1px] border-[#727272]',
        LoginFormPassword: '',
        LoginFormLoginButton: 'w-80 h-14 bottom-[0px] absolute bg-neutral-700 bg-opacity-50 rounded-2xl flex items-center justify-center',
    },
    variants: {
        color:{
            light: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/light/sky_00421.jpg")]',
                container: '',
            },
            dark: {
                //background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg")]',
                background: 'bg-black',
                container: '',
            },
        },
        isMobile: {
            true: {
                background: "",
            },
            false: {
                background: "",
            },
        }
    }
});