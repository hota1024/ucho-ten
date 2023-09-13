import React, {useState, useRef, useCallback} from "react";
import { createPostPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useDropzone, FileWithPath } from 'react-dropzone'
import 'react-circular-progressbar/dist/styles.css';
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
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

import {Accordion, AccordionItem} from "@nextui-org/react";

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
    uploadImageAvailable?: boolean
    isDragActive?: boolean
    open?: boolean
}
export const CreatePostPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, uploadImageAvailable, open} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const { background, SearchBar, SearchBarInputArea,Label,SearchButton,
    } = createPostPage();
    
    const trailingActions = () => (
        <TrailingActions>
            <SwipeAction
                destructive={true}
                onClick={() => console.info('swipe action triggered')}
            >
                <div style={{backgroundColor:'red', color:'white',}}>delete</div>
            </SwipeAction>
        </TrailingActions>
    );

  return (
      <main className={background({color:color, isMobile:isMobile})}>
          <div className={SearchBar()}>
              <input className={SearchBarInputArea()} placeholder={'search already set mute word or category'}/>
              <Button isIconOnly variant={'light'} disableRipple className={SearchButton()}>
                  <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
              </Button>
          </div>
          <div className={Label()}>Category</div>
          <Accordion>
              <AccordionItem key="1" aria-label="Accordion 1" title="下ネタ">
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={'h-[54px] w-full flex items-center border-b border-t '}>ちんちん</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={'h-[54px] w-full flex items-center border-b border-t '}>うんこ</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={'h-[54px] w-full flex items-center border-b border-t '}>おもろすぎ</div>
                      </SwipeableListItem>
                  </SwipeableList>
              </AccordionItem>
              <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                  2
              </AccordionItem>
              <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                  3
              </AccordionItem>
          </Accordion>
      </main>
  );
}

export default CreatePostPage;