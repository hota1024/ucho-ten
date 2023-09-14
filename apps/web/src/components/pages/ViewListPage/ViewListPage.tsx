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
    useSearchBar: true | false
    useFooterInputArea: true | false
}
export const CreatePostPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile,useSearchBar, useFooterInputArea} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const { background, SearchBar, SearchBarInputArea,Label,SearchButton,ListItem,AccordionItemContent,
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
          {useSearchBar && (
              <div className={SearchBar({color:color, isMobile:isMobile})}>
                  <input className={SearchBarInputArea({color:color, isMobile:isMobile})} placeholder={'search already set mute word or category'}/>
                  <Button isIconOnly variant={'light'} disableRipple className={SearchButton({color:color, isMobile:isMobile})}>
                      <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                  </Button>
              </div>
          )}
          <div className={Label({color: color})}>Category</div>
          <Accordion isCompact
                     itemClasses={({title: color === 'dark' ? 'text-white pl-[20px]' : 'text-black pl-[20px]',
                     })}
          >
              <AccordionItem key="1" aria-label="Accordion 1" title="Accprdion 1">
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
              </AccordionItem>
              <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
              </AccordionItem>
              <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
                  <SwipeableList>
                      <SwipeableListItem
                          trailingActions={trailingActions()}
                          maxSwipe={100} // You can adjust this value as needed
                      >
                          <div className={AccordionItemContent({color:color})}>hoge</div>
                      </SwipeableListItem>
                  </SwipeableList>
              </AccordionItem>
          </Accordion>
          {useFooterInputArea && (
              <div className={''}>
                  
              </div>
          )}
      </main>
  );
}

export default CreatePostPage;