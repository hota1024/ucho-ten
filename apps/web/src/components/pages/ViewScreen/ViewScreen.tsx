import React, { useState, useEffect } from "react";
import { viewScreen } from "./styles";
import { ViewHeader } from "../ViewHeader";
import { TabBar } from "../TabBar";
import {ViewPostCard} from "../ViewPostCard";
import {Spinner} from "@nextui-org/react";


interface Props {
    className?: string;
    color: "light" | "dark";
    isMobile?: boolean;
    uploadImageAvailable?: boolean;
    isDragActive?: boolean;
    open?: boolean;
}

export const ViewScreen: React.FC<Props> = (props: Props) => {
    const { className, color, isMobile, uploadImageAvailable, open } = props;
    const { background, tabbar } = viewScreen();
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<any[]>([]);

    const fetchResult = async () => {
        try {
            const res = await fetch('https://search.bsky.social/search/posts?q=a')
            const json = await res.json()
            setSearchResult(json);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchResult();
    }, []);

    return (
        <main className={background({ color: color, isMobile: isMobile })}>
            <div className={'h-full max-w-[600px] min-w-[350px]'}>
                <ViewHeader color={color} page={"search"}/>
                <div className={'h-[calc(100svh-50px)] overflow-scroll pt-[100px]'}>
                    {loading ? (
                        <Spinner/>
                    ) : (
                        searchResult.map((post) => (
                            <ViewPostCard color={color} numbersOfImage={0} postJson={post} isMobile={isMobile}/>
                        ))
                    )}
                </div>
                <TabBar
                    className={tabbar()}
                    color={color}
                    selected={'search'}
                />
            </div>
        </main>
    );
};

export default ViewScreen;
