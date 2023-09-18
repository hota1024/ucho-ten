import React, {useState, useRef, useCallback} from "react";
import { viewSideBar } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faBookmark, faVolumeXmark, faRss, faUser, faHand, faGear, faFlag, faCircleQuestion, faUsers, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useDropzone, FileWithPath } from 'react-dropzone'
import 'react-circular-progressbar/dist/styles.css';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
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
    isBarOpen: boolean
}
export const ViewSideBar: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, uploadImageAvailable, open, isBarOpen} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const { background, AuthorIconContainer,Content, Footer, AuthorDisplayName, AuthorHandle, NavBarIcon,NavBarItem,bg
    } = viewSideBar();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
      <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                  {(onClose) => (
                      <>
                          <ModalHeader>Would you like to log out?</ModalHeader>
                          <ModalFooter>
                              <Button color="danger" variant="light" onPress={onClose}>
                                  No
                              </Button>
                              <Button color="primary" onPress={onClose}>
                                  Yes
                              </Button>
                          </ModalFooter>
                      </>
                  )}
              </ModalContent>
          </Modal>
          <main className={bg({isBarOpen: props.isBarOpen})}
            onClick={() => {
                console.log('hoge')

            }}
          >
              <main className={background({color:color, isMobile:isMobile, isBarOpen:props.isBarOpen})}
                       onClick={(e) => {
                           e.stopPropagation()
                       }}
              >
                  <div className={AuthorIconContainer()}>
                      <img className={'h-[64px] w-[64px] rounded-[10px]'}
                           src={'https://av-cdn.bsky.app/img/avatar/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreihwad5kaujw2f6kbfg37zmkhclgd3ap7grixl6pusfb5b34s6jite@jpeg'}/>
                      <div className={'ml-[12px]'}>
                          <div className={AuthorDisplayName()}>ばいそに</div>
                          <div className={AuthorHandle({color:color})}>@bisn.ucho-ten.net</div>
                      </div>
                  </div>
                  <div className={Content()}>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faBookmark} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Bookmark</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faVolumeXmark} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Mute</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faRss} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Feeds</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faUser} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Profile</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faHand} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Contents Filtering</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faGear} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Settings</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faFlag} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Bug Report</div>
                      </div>
                  </div>
                  <div className={Footer()}>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faCircleQuestion} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>About</div>
                      </div>
                      <div className={NavBarItem()}>
                          <FontAwesomeIcon icon={faUsers} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Switching Account</div>
                      </div>
                      <div className={NavBarItem()}
                           onClick={() => {
                               if(isMobile) {
                                   const res = window.confirm('Would you like to log out?')
                               } else {
                                   onOpen()
                               }
                           }}
                      >
                          <FontAwesomeIcon icon={faRightFromBracket} className={NavBarIcon()}></FontAwesomeIcon>
                          <div>Logout</div>
                      </div>
                  </div>
              </main>
          </main>
      </>
  );
}

export default ViewSideBar;