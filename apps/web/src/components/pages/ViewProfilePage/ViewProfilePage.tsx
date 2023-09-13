import React, {useState, useRef, useCallback} from "react";
import { viewProfilePage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faCopy, faEllipsis } from '@fortawesome/free-solid-svg-icons'
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
    isProfileMine: true | false
}
export const ViewProfilePage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile,isProfileMine} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const { background, ProfileContainer, ProfileInfoContainer, HeaderImageContainer, ProfileHeaderImage,
        ProfileImage, ProfileDisplayName, ProfileHandle, ProfileCopyButton, ProfileActionButton,FollowButton,ProfileBio,Buttons, PropertyButton, PostContainer,
    } = viewProfilePage();


  return (
      <main className={background({color:color, isMobile:isMobile})}>
          <div className={ProfileContainer()}>
              <div className={HeaderImageContainer()}>
                  <img className={ProfileHeaderImage()} src={'https://av-cdn.bsky.app/img/banner/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreih4ssgoypcz4l77de4lvdoxzpub52m7e6ugmg6c4uqp65uqubn4oa@jpeg'}></img>
              </div>
              <div className={ProfileInfoContainer()}>
                  <img className={ProfileImage()} src={'https://av-cdn.bsky.app/img/avatar/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreihwad5kaujw2f6kbfg37zmkhclgd3ap7grixl6pusfb5b34s6jite@jpeg'}></img>
                  <div className={Buttons()}>
                      <Dropdown>
                          <DropdownTrigger>
                              <div className={ProfileCopyButton()}>
                                  <FontAwesomeIcon icon={faCopy} className={PropertyButton()}/>

                              </div>
                          </DropdownTrigger>
                          <DropdownMenu >
                              <DropdownItem
                                  key="new"
                              >Copy DID</DropdownItem>
                              <DropdownItem
                                  key="copy"
                              >Copy Handle</DropdownItem>
                              <DropdownItem
                                  key="edit"
                                  showDivider
                              >Copy DisplayName</DropdownItem>
                              <DropdownItem
                                  key="delete"
                              >
                                  Delete file
                              </DropdownItem>
                          </DropdownMenu>
                      </Dropdown>
                      {!isProfileMine &&(
                          <Dropdown>
                              <DropdownTrigger>
                                  <div className={ProfileActionButton()}>
                                      <FontAwesomeIcon icon={faEllipsis} className={PropertyButton()}/>
                                  </div>
                              </DropdownTrigger>
                              <DropdownMenu >
                                  <DropdownItem
                                      key="report"
                                  >Mute @bisn.ucho-ten.net</DropdownItem>
                                  <DropdownItem
                                      key="report"
                                  >Report @bisn.ucho-ten.net</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
                      )}
                      <Button className={FollowButton()}>
                          {isProfileMine ? ('Edit Profile') : ('Follow')}
                      </Button>
                  </div>
                  <div className={ProfileDisplayName()}>ばいそに</div>
                  <div className={ProfileHandle({isMobile:isMobile})}>@bisn.ucho-ten.net</div>
                  <div className={ProfileBio({isMobile:isMobile})}>あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ</div>
              </div>
          </div>
          <div className={PostContainer()}>
              
          </div>
      </main>
  );
}

export default ViewProfilePage;