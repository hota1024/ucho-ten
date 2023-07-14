'use client'
import React, { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createTheme } from '@nextui-org/react';

interface ChangeAppearanceColorProps {
    children: ReactNode;
}

const ChangeAppearanceColor: React.FC<ChangeAppearanceColorProps> = ({
                                                                         children,
                                                                     }) => {
    const localAppeeranceColorMode = localStorage.getItem('appearanceColorMode') ?? 'system'

    const lightTheme = createTheme({
        type: 'light',
        theme: {},
    });

    const darkTheme = createTheme({
        type: 'dark',
        theme: {},
    });
    console.log(localAppeeranceColorMode)
    return localAppeeranceColorMode === '"dark"' ? (
        <NextThemesProvider
            defaultTheme={darkTheme.className}
            attribute="class"
        >
            {children}
        </NextThemesProvider>
    ) : (
        <NextThemesProvider
            defaultTheme={lightTheme.className}
            attribute="class"
        >
            {children}
        </NextThemesProvider>
    );
};

export default ChangeAppearanceColor;