'use client'
import React,{ useEffect,useState } from 'react';
/*import {
    useAppearanceColorMode
} from '@/atoms/settings';*/
import useDarkMode from 'use-dark-mode';


interface InsertBackgroundImageProps {}

export const InsertBackgroundImage: React.FC<InsertBackgroundImageProps> = () => {
    const [mounted, setMounted] = useState(false)
    //const localAppearanceColorMode = JSON.parse(localStorage.getItem('appearanceColorMode') ?? 'system');
    //const [appearanceColorMode, setAppearanceColorMode] = useAppearanceColorMode();
    const [appearanceColorMode, setAppearanceColorMode] = 'system'
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
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                visibility: mounted ? 'visible' : 'hidden',
            }}
        >
            <img
                src={
                    appearanceColorMode === 'dark'
                        ? darkModeBGI
                        : appearanceColorMode === 'light'
                            ? lightModeBGI
                            : darkMode.value
                                ? darkModeBGI
                                : lightModeBGI
                }
                alt="background"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    visibility: mounted ? 'visible' : 'hidden',
                }}
                draggable="false"
            />
        </div>
    );
};

export default InsertBackgroundImage;