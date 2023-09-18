import React, {useState, useRef, useCallback} from "react";
import { viewHeader } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faChevronLeft, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import 'react-circular-progressbar/dist/styles.css';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Button,
    Image,
    Spinner,
    ScrollShadow,
    Popover, PopoverTrigger, PopoverContent,
} from "@nextui-org/react";

import {Tabs, Tab, Chip} from "@nextui-org/react";


interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
    open?: boolean
    page: 'single' | 'profile' | 'home' | 'post' | 'search'
    isNextPage? : boolean
    setValue?: any
    selectedTab: string
}
export const ViewHeader: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, open, page, isNextPage, setValue, selectedTab} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false)
    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)
    const {Header, HeaderContentTitleContainer, HeaderContentTitle,
            top,
            bottom,
    } = viewHeader();
    const AppearanceColor = color

    const pageNavigatorList = {
        'post':["Author's","Other's"],
        'search':['Posts','Feeds','Users'],
        'home':[''],
        'profile':['Posts','Replies','Media','Feeds'],
        'single':['Bookmark']
    }
    const subscribeFeeds = {
        'Japanese Cluster': {did:'did:ucho:z6MkZ7JY7J6X7J6',name:'Japanese Cluster'},
        'JP': {did:'did:ucho:z6MkZ7JY7J6X7J6',name:'Japanese Cluster'},
        'KR': {did:'did:ucho:z6MkZ7JY7J6X7J6',name:'Japanese Cluster'},
        '同担拒否': {did:'did:ucho:z6MkZ7JY7J6X7J6',name:'Japanese Cluster'},
    }
    return (
        <main className={Header()}>
            <div className={top()}>
                <Button
                    className={'absolute left-[0px] p-[20px] text-white'}
                    variant="light"
                    startContent={<FontAwesomeIcon
                        className={'h-[20px]'}
                        icon={isNextPage ? faChevronLeft : faBars}/>}
                    onClick={() => {
                        setIsSideBarOpen(!isSideBarOpen)
                        //console.log(setValue)
                        props.setValue(true)
                    }}
                />
                {selectedTab === 'search' ? (
                    <div
                        className={'h-[40px] w-[60%] rounded-[10px] overflow-hidden text-black relative'}

                    >
                        <input
                            className={'h-full w-full outline-none text-black pl-[20px]'}
                            value={searchText}
                            autoFocus={true}
                            onChange={(e) => {setSearchText(e.target.value)}}
                            placeholder={'search word'}
                        />
                        {searchText.length > 0 && (
                            <Button
                                className={'absolute right-[0px] top-[0px] p-[10px]'}
                                isIconOnly
                                startContent={
                                    <FontAwesomeIcon className={'h-[20px]'} icon={faXmark}/>
                                }
                                onClick={() => {setSearchText("")}}
                            >

                            </Button>
                        )}
                    </div>
                ) : (
                    <img
                        className={'h-[100%] w-[145px]'}
                        src={'https://raw.githubusercontent.com/hota1024/ucho-ten/190ebcbd9619eb94c85d81d64285b16f36508a47/public/images/Logo/ucho-ten.svg'}/>
                )}
                {selectedTab === 'single' && (
                    <Button
                        variant="light"
                        className={'absolute right-[0px] p-[20px] text-white'}
                        startContent={
                            <FontAwesomeIcon
                                className={'h-[20px]'}
                                icon={faPlus}
                            />
                        }
                    />
                )}

            </div>
            <ScrollShadow className={bottom({page:page})}
                          style={{overflowX:'scroll', overflowY:'hidden'}}
                          orientation="horizontal"
                          hideScrollBar>
                {selectedTab === 'home'  && (
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        variant="underlined"
                        classNames={{
                            tabList: "w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#6A52FF]",
                            tab: "max-w-fit px-0 h-[100%]",
                            tabContent: "group-data-[selected=true]:text-white"
                        }}
                        style={{marginLeft:'40px'}}
                    >
                        <Tab key="1"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px]">
                                     <span>Following</span>
                                 </div>
                             }
                        />
                        <Tab key="2"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px]">
                                     <span>Followers</span>
                                 </div>
                             }
                        />
                        <Tab key="3"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px]">
                                     <span>Japanese Cluster</span>
                                 </div>
                             }
                        />
                        <Tab key="4"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px]">
                                     <span>JP</span>
                                 </div>
                             }
                        />
                        <Tab key="5"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px]">
                                     <span>EN</span>
                                 </div>
                             }
                        />
                        <Tab key="6"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px]">
                                     <span>KR</span>
                                 </div>
                             }
                        />
                    </Tabs>
                )}
                {selectedTab === 'single' && (
                    <div className={HeaderContentTitle({page:page})}>Bookmark</div>
                )}
                {selectedTab === 'post' && (
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        variant="underlined"
                        classNames={{
                            tabList: "w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#6A52FF]",
                            tab: "max-w-fit px-0 h-[100%]",
                            tabContent: "group-data-[selected=true]:text-white"
                        }}
                    >
                        <Tab key="1"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Author's</span>
                                 </div>
                             }
                        />
                        <Tab key="2"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Other's</span>
                                 </div>
                             }
                        />
                    </Tabs>
                )}
                {selectedTab === 'search'  && (
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        variant="underlined"
                        classNames={{
                            tabList: "w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#6A52FF]",
                            tab: "max-w-fit px-0 h-[100%]",
                            tabContent: "group-data-[selected=true]:text-white"
                        }}
                    >
                        <Tab key="1"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Posts</span>
                                 </div>
                             }
                        />
                        <Tab key="2"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Feeds</span>
                                 </div>
                             }
                        />
                        <Tab key="3"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Users</span>
                                 </div>
                             }
                        />
                    </Tabs>
                )}
                {selectedTab === 'profile'  && (
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        variant="underlined"
                        classNames={{
                            tabList: "w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#6A52FF]",
                            tab: "max-w-fit px-0 h-[100%]",
                            tabContent: "group-data-[selected=true]:text-white"
                        }}
                    >
                        <Tab key="1"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Posts</span>
                                 </div>
                             }
                        />
                        <Tab key="2"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Replies</span>
                                 </div>
                             }
                        />
                        <Tab key="3"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Media</span>
                                 </div>
                             }
                        />
                        <Tab key="4"
                             title={
                                 <div className="flex items-center pl-[15px] pr-[15px] w-[50%]">
                                     <span>Feeds</span>
                                 </div>
                             }
                        />
                    </Tabs>
                )}
            </ScrollShadow>
        </main>
    );
}

export default ViewHeader;