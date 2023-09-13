import React, {useState, useRef, useCallback} from "react";
import { viewFeedPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faArrowUpFromBracket, faThumbTack } from '@fortawesome/free-solid-svg-icons'
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
    Popover, PopoverTrigger, PopoverContent,useDisclosure
} from "@nextui-org/react";

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
    isProfileMine?: true | false
    isSubscribe?: true | false
    isPinned?: true | false
}
export const ViewFeedPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile,isProfileMine, isSubscribe, isPinned} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const { background, ProfileContainer, ProfileInfoContainer, HeaderImageContainer, ProfileHeaderImage,
        ProfileImage, ProfileDisplayName, ProfileHandle, ProfileCopyButton, ProfileActionButton,FollowButton,ProfileBio,Buttons, ShareButton, PostContainer, PinButton,
    } = viewFeedPage();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [onHoverButton, setOnHoverButton] = useState(false);



    return (
      <main className={background({color:color, isMobile:isMobile})}>
          <div className={ProfileContainer()}>
              <div className={ProfileInfoContainer()}>
                  <img className={ProfileImage()} src={'https://av-cdn.bsky.app/img/avatar/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreihwad5kaujw2f6kbfg37zmkhclgd3ap7grixl6pusfb5b34s6jite@jpeg'}></img>
                  <div className={Buttons()}>
                      <Dropdown>
                          <DropdownTrigger>
                              <div className={ProfileCopyButton()}>
                                  <FontAwesomeIcon icon={faArrowUpFromBracket} className={ShareButton({color:color})}/>

                              </div>
                          </DropdownTrigger>
                          <DropdownMenu >
                              <DropdownItem
                                  key="new"
                              >Copy feed url</DropdownItem>
                              <DropdownItem
                                  key="copy"
                              >Post this feed</DropdownItem>
                          </DropdownMenu>
                      </Dropdown>
                      <div className={ProfileActionButton()}>
                          <FontAwesomeIcon icon={faThumbTack} className={PinButton({isPinned:isPinned})}/>
                      </div>
                      <Button className={FollowButton()}
                        onMouseLeave={() => {
                            setOnHoverButton(false)
                        }}
                        onMouseEnter={() => {
                            setOnHoverButton(true)
                        }}
                      >
                          {isSubscribe ? ('UnSubscribe') : ('Subscribe')}
                      </Button>
                  </div>
                  <div className={ProfileDisplayName()}>ばいそに</div>
                  <div className={ProfileHandle({isMobile:isMobile})}>created by @bisn.ucho-ten.net</div>
                  <div className={ProfileBio({isMobile:isMobile})}>あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ</div>
              </div>
          </div>
          <div className={PostContainer()}>

          </div>
      </main>
  );
}

export default ViewFeedPage;