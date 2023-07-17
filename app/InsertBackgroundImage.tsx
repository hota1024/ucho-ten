'use client'
import React,{ useEffect,useState } from 'react';
import {
    useAppearanceColorMode
} from '@/atoms/settings'
/*import {
    useAppearanceColorMode
} from '@/atoms/settings';*/
import useDarkMode from 'use-dark-mode';
import 'react-medium-image-zoom/dist/styles.css'



interface InsertBackgroundImageProps {
    children: React.ReactNode;
}

export const InsertBackgroundImage: React.FC<InsertBackgroundImageProps> = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false)
    //const localAppearanceColorMode = JSON.parse(localStorage.getItem('appearanceColorMode') ?? 'system');
    const [appearanceColorMode, setAppearanceColorMode] = useAppearanceColorMode();
    //const [appearanceColorMode, setAppearanceColorMode] = 'system'
    const darkMode = useDarkMode(false)
    console.log(appearanceColorMode)
    //console.log(localStorage)

    const darkModeBGI = 'https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg';
    const lightModeBGI = '/images/backgroundimg/sky_00421.jpg';


    useEffect(() => {
        console.log("appearanceColorMode changed:", appearanceColorMode);
        // Perform any actions or logic based on the updated appearanceColorMode state

        // Additional code...
        try{
            if(typeof window !== 'undefined'){
                setMounted(true)
            }
        }catch (e) {

        }
    }, [appearanceColorMode]);

    return (
        <body
            style={{
                backgroundImage: appearanceColorMode === 'dark' ? `url(${darkModeBGI})` : appearanceColorMode === "light" ? `url(${lightModeBGI})` : darkMode.value ? `url(${darkModeBGI})` : `url(${lightModeBGI})`,
                backgroundSize: 'cover',
                backgroundColor: ( appearanceColorMode === 'dark' || appearanceColorMode === "system" && darkMode.value) ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
                backgroundBlendMode: ( appearanceColorMode === 'dark' || appearanceColorMode === "system" && darkMode.value) ? 'darken' : 'lighten',
            }}
        >
        {children}
        </body>
    )
};

export default InsertBackgroundImage;