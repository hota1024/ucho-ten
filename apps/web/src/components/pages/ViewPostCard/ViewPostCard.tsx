import React, {useState, useRef, useCallback} from "react";
import { viewPostCard } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faRetweet, faEllipsis, faFlag, faLink, faCode, faFont } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faSolidRegular } from '@fortawesome/free-solid-svg-icons'

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
    Input,
    Link,
    Popover, PopoverTrigger, PopoverContent,
} from "@nextui-org/react";

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

import Textarea from 'react-textarea-autosize'; // 追加

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
    uploadImageAvailable?: boolean
    isDragActive?: boolean
    open?: boolean
    numbersOfImage: 0 | 1 | 2 | 3 | 4,
}
export const ViewPostCard: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, uploadImageAvailable, open, numbersOfImage} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const [isHover, setIsHover] = useState<boolean>(false)
    const { PostCard, PostAuthor, PostContent, PostReactionButtonContainer, PostCardContainer, PostReactionButton,
        PostAuthorIcon, PostAuthorDisplayName, PostAuthorHandle, PostCreatedAt } = viewPostCard();

  return (
      <main className={PostCard({color:color})}>
          <div className={PostCardContainer()}
               onMouseEnter={() => {
                   setIsHover(true)
               }}
                onMouseLeave={() => {
                    setIsHover(false)
                }}
          >
              <div className={PostAuthor()}>
                  <div className={PostAuthorIcon()}>
                      <img src={'https://av-cdn.bsky.app/img/avatar/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreihwad5kaujw2f6kbfg37zmkhclgd3ap7grixl6pusfb5b34s6jite@jpeg'}></img>
                  </div>
                  <div className={PostAuthorDisplayName()} style={{fontSize:'13px'}}>
                      <div>ばいそに</div>
                  </div>
                  <div className={'text-[#BABABA]'}>&nbsp;-&nbsp;</div>
                  <div className={PostAuthorHandle()}>
                      <div>{"bisn.ucho-ten.net"}</div>
                  </div>
                  <div className={PostCreatedAt()} style={{fontSize:'12px'}}>
                      {isHover ? (
                          <Dropdown>
                              <DropdownTrigger>
                                  <FontAwesomeIcon icon={faEllipsis} className={'h-[20px] mb-[4px] cursor-pointer text-[#909090]'}/>
                              </DropdownTrigger>
                              <DropdownMenu
                                  disallowEmptySelection
                                  aria-label="Multiple selection actions"
                                  selectionMode="multiple"
                              >
                                  <DropdownItem key='1' startContent={<FontAwesomeIcon icon={faFlag}/>}>Report Post</DropdownItem>
                                  <DropdownItem key='2' startContent={<FontAwesomeIcon icon={faLink}/>}>Copy Post URL</DropdownItem>
                                  <DropdownItem key='2' startContent={<FontAwesomeIcon icon={faCode}/>}>Copy Post JSON</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
                      ) : (
                          <a href={'https://bsky.social/'}>1d</a>
                      )}
                  </div>
              </div>
              <div className={PostContent({isMobile:isMobile})} style={{}}>
                  <div className={''}>あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。</div>
                  {numbersOfImage > 0 && (
                      <div className={'mt-[10px] mb-[10px] rounded-[7.5px] overflow-hidden'}>
                          {numbersOfImage === 1 && (
                              <img className={'w-full h-full'} src={'https://av-cdn.bsky.app/img/feed_thumbnail/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreicjjy62rajw47mhgx4iaqvqywvmxdcfjttwhj3vu3y7c5spzapwwq@jpeg'}></img>
                          )}
                      </div>
                  )}
              </div>
              <div className={PostReactionButtonContainer()} style={{}}>
                  <div className={'mr-[12px]'}>
                      <FontAwesomeIcon icon={faComment} className={PostReactionButton()}></FontAwesomeIcon>
                      <FontAwesomeIcon icon={faRetweet} className={PostReactionButton()}></FontAwesomeIcon>
                      <FontAwesomeIcon icon={faHeartRegular} className={PostReactionButton()}></FontAwesomeIcon>
                  </div>
              </div>
          </div>
      </main>
  );
}

export default ViewPostCard;