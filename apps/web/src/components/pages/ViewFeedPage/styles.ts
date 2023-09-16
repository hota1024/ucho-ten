import { tv } from "@nextui-org/react";

export const viewFeedPage = tv({
    slots: {
        background: 'max-w-[500px] min-w-[350px] w-full',
        ProfileContainer: 'w-full h-full  border-[#E3E3E3] border-bottom-[1px]',
        HeaderImageContainer: 'w-full h-[130px] relative',
        ProfileHeaderImage: 'h-full w-full object-cover',
        ProfileInfoContainer: 'w-full h-full relative pl-[13px] pr-[8px] pb-[16px] pt-[21px]',
        ProfileImage: 'h-[50px] w-[50px] rounded-[10px] absolute',
        ProfileDisplayName: 'font-black text-[24px] mt-[12px] ml-[3px]',
        ProfileHandle: 'text-[#B8B8B8] font-medium ml-[3px]',
        ProfileBio: 'mt-[8px] mr-[20px] text-[#B8B8B8] font-medium ml-[3px]',
        ProfileCopyButton: 'h-[32px] w-[32px] ml-[10px] mr-[10px] flex justify-center items-center cursor-pointer',
        ProfileActionButton: 'h-[32px] w-[32px] ml-[10px] mr-[10px] flex justify-center items-center cursor-pointer',
        FollowButton: 'mr-[8px] ml-[10px]',
        Buttons: 'flex justify-end h-[50px] w-full flex items-center',
        PinButton: '',
        ShareButton: '',
        PostContainer: 'w-full h-full',
        dropdown: '',
    },
    variants: {
        color:{
            light: {
                ProfileContainer: 'bg-white',
                ShareButton: 'text-black',
            },
            dark: {
                ProfileContainer: 'bg-black',
                ShareButton: 'text-white',
                ProfileDisplayName: 'text-white',
                dropdown: 'dark text-white',
                FollowButton: 'dark text-white',
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
        isPinned: {
            true: {
                PinButton: 'text-[#016EFF]'
            },
            false: {
                PinButton: 'text-[#929292]'
            }
        }
    }
});