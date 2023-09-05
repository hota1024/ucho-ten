import { tv } from "@nextui-org/react";

export const createPostPage = tv({
    slots: {
        Container: "w-96 h-96 relative",
        Header: "w-96 h-11 left-0 top-0 absolute",
        HeaderTitle: "w-9 left-[177.46px] top-[11px] absolute text-white text-base font-bold",
        HeaderPostButton: "w-24 h-9 right-[4px] top-[3px] absolute",
        Content: 'w-96 h-80 left-0 top-[43px] absolute',
        Footer: "w-96 h-96 left-0 top-0 absolute",
        FooterBackgroundColor: "w-96 h-14 left-0 top-[381px] absolute bg-zinc-300",

    }
});