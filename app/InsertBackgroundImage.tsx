'use client'
import React, { ReactNode } from 'react';
import useDarkMode from "use-dark-mode";
interface InsertBackgroundImage {

}
export const InsertBackgroundImage: React.FC<InsertBackgroundImage> = () => {
    const darkMode = useDarkMode(false)
    console.log(darkMode)
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden', // 画像のはみ出しを防ぐために追加
            }}
        >
            <img
                src={!darkMode.value ? '/images/backgroundimg/sky_00421.jpg' : 'https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg'}
                alt="background"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',

                }}
                draggable="false"
            />
        </div>
    );
}