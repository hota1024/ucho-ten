import { tv } from "@nextui-org/react";

export const viewProfilePage = tv({
    slots: {
        background: 'max-w-[500px] min-w-[350px]',
        ProfileContainer: 'w-full h-full bg-white border-[#E3E3E3] border-bottom-[1px]',
        HeaderImageContainer: 'w-full h-[130px] relative',
        ProfileHeaderImage: 'h-full w-full object-cover',
        ProfileInfoContainer: 'w-full h-full relative pl-[13px] pr-[8px] pb-[16px]',
        ProfileImage: 'h-[80px] w-[80px] rounded-[10px] top-[-24px] absolute',
        ProfileDisplayName: 'font-black text-[24px]',
        ProfileHandle: '',
        ProfileBio: 'mt-[8px] ml-[4px] mr-[20px]',
        ProfileCopyButton: 'h-[32px] w-[32px] ml-[10px] mr-[10px] border-[2px] border-[#929292] rounded-full flex justify-center items-center cursor-pointer',
        ProfileActionButton: 'h-[32px] w-[32px] ml-[10px] mr-[10px] border-[2px] border-[#929292] rounded-full flex justify-center items-center cursor-pointer',
        FollowButton: 'mr-[8px] ml-[10px]',
        Buttons: 'flex justify-end h-[56px] w-full flex items-center',
        PropertyButton: 'text-[#929292]',
        PostContainer: 'w-full h-full',
    },
    variants: {
        color:{
            light: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/light/sky_00421.jpg")]',
            },
            dark: {
                background: 'bg-cover bg-[url("https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg")]',
            },
        },
        isMobile: {
            true: {
                background: "",
                ProfileHandle: 'text-[12px]',
                ProfileBio: 'text-[12px]',
            },
            false: {
                background: "relative justify-center",
            },
        },
    }
});