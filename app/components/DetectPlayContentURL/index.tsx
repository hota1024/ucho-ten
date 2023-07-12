import React, { ReactNode } from 'react';

interface DetectPlayContentURLProps {
    record: {
        text: string;
        facets?: any[];
    };
}

export const DetectPlayContentURL: React.FC<DetectPlayContentURLProps> = (props) => {
    const { record } = props;

    // record.textがない場合は何も表示しない
    if (record.text === '') {
        return null;
    }

    let videoId = '';
    let hasYouTube = false;

    const textElements: ReactNode[] = record.text.split('\n').map((line, index) => {
        const matches = line.match(/(@[a-zA-Z0-9-.]+|https?:\/\/[a-zA-Z0-9-./?=_%&:#@]+)/g) as any
        if (matches) {
            return matches.map((match: string, i: number) => {
                if (match.startsWith('http')) {
                    const url = new URL(match);
                    if (url.hostname === 'youtu.be') {
                        videoId = url.pathname.substring(1);
                        hasYouTube = true;
                        return null;
                    } else if (url.hostname === 'www.youtube.com' || url.hostname === 'm.youtube.com') {
                        const searchParams = new URLSearchParams(url.search);
                        videoId = searchParams.get('v') as string
                        hasYouTube = true
                    }
                }
                return match;
            });
        }
        return line;
    });

    if (hasYouTube) {
        return (
            <div style={{ width: '485px', height: '273px', overflow: 'hidden', borderRadius: '10px' }}>
                <iframe
                    width="485"
                    height="273"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>

        );
    } else {
        return null
    }
};