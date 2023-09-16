import React, {useState, useRef, useCallback} from "react";
import { postOnlyPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faComment, faSquare as faRegularSquare, faBookmark as faRegularBookmark, } from '@fortawesome/free-regular-svg-icons'
import { faRetweet, faQuoteLeft, faSquare as faSolidSquare, faBookmark as faSolidBookmark, faEllipsis, faArrowUpFromBracket, faTrash, faFlag, faCode, faUser, faU, faLanguage} from '@fortawesome/free-solid-svg-icons'
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
    Popover, PopoverTrigger, PopoverContent,
} from "@nextui-org/react";

import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
    uploadImageAvailable?: boolean
    isDragActive?: boolean
    open?: boolean
    isLiked?: true | false
    isReposted?: true | false
    isBookmarked?: true | false
    isPostMine: true | false


}
export const PostOnlyPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, uploadImageAvailable, open,
           isLiked, isReposted, isBookmarked, isPostMine
    } = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const [isTranslated, setIsTranslated] = useState(false)
    const [translatedText, setTranslatedText] = useState<string | null>(null)
    const [viewTranslatedText, setViewTranslatedText] = useState<boolean>(true)
    const [translateError, setTranslateError] = useState<boolean>(false)

    const { Container,AuthorPost,Author, AuthorIcon, AuthorDisplayName,AuthorHandle,PostContent,PostCreatedAt,ReactionButtonContainer,ReactionButton,dropdown
    } = postOnlyPage();

    const leadingActions = () => (
        <LeadingActions>
            <SwipeAction onClick={() => console.info('swipe action triggered')}>
                <span style={{backgroundColor:'cyan'}}>Reply</span>
            </SwipeAction>
        </LeadingActions>
    );

    const trailingActions = () => (
        <TrailingActions>
            <SwipeAction
                onClick={() => console.info('swipe action triggered')}
            >
                <span style={{backgroundColor:'pink'}}>Like</span>
            </SwipeAction>
        </TrailingActions>
    );

    return (
        <main className={Container({color:color})}>
            <div className={AuthorPost()}>
                <div className={Author()}>
                    <div className={AuthorIcon()}></div>
                    <div>
                        <div className={AuthorDisplayName()}>ばいそに</div>
                        <div className={AuthorHandle()}>@bisn.ucho-ten.net</div>
                    </div>
                </div>
                <div className={PostContent()}>
                    <SwipeableList>
                        <SwipeableListItem
                            maxSwipe={80} // ここに適切な maxSwipe の値を設定する
                            leadingActions={leadingActions()}
                            trailingActions={trailingActions()}
                        >
                            親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃たからである。小使に負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。
                        </SwipeableListItem>
                    </SwipeableList>
                    {translateError && (
                        <div className={'text-red-500'}>
                            Translation error
                        </div>
                    )}
                    {translatedText !== null && viewTranslatedText && (
                        <>
                            <div className={'select-none'}>
                                Translated by Google
                            </div>
                            <div>
                                {translatedText}
                                <span
                                    onClick={() => {
                                        setViewTranslatedText(false)
                                    }}
                                    className={'cursor-pointer'}
                                > - View original text </span>
                            </div>
                        </>

                    )}
                </div>
                <div className={PostCreatedAt()}>
                    2021-09-01 12:00:00
                </div>
                <div className={ReactionButtonContainer()}>
                    <FontAwesomeIcon icon={faComment} className={ReactionButton()}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faQuoteLeft} className={ReactionButton()}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faRetweet} className={ReactionButton()}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={!isLiked ? faRegularSquare : faSolidSquare} className={ReactionButton()}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={!isBookmarked ? faRegularBookmark: faSolidBookmark} className={ReactionButton()}></FontAwesomeIcon>
                    <Dropdown className={dropdown({color:color})}>
                        <DropdownTrigger>
                            <FontAwesomeIcon icon={faEllipsis} className={ReactionButton()}/>
                        </DropdownTrigger>
                        <DropdownMenu>
                            {/*@ts-ignore*/}
                            <DropdownSection title="Actions" showDivider>
                                {!isPostMine && (
                                    <DropdownItem key="report"
                                                  startContent={<FontAwesomeIcon icon={faFlag} />}
                                    >
                                        Report
                                    </DropdownItem>
                                )}
                                <DropdownItem key="share"
                                              startContent={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
                                >
                                    Share
                                </DropdownItem>
                                <DropdownItem key="translate"
                                              startContent={<FontAwesomeIcon icon={faLanguage} />}
                                              onClick={async() => {
                                                  setIsTranslated(true)
                                                  setViewTranslatedText(true)
                                                  const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=auto&dt=t&q=' + encodeURIComponent('親譲の無鉄砲で小供の時から損ばかりしている。\n小学校に居る時分学校の二階から飛び降りて一週間ほど腰こしを抜ぬかした事がある。なぜそんな無闇むやみをしたと聞く人があるかも知れぬ。別段深い理由でもない。\n新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張いばっても、そこから飛び降りる事は出来まい。\n弱虫やーい。\nと囃たからである。小使に負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。'))
                                                  if(res.status === 200) {
                                                      const json = await res.json()
                                                      if(json[0] !== undefined) {
                                                          const combinedText = json[0].reduce((acc: string, item: any[]) => {
                                                              if (item[0]) {
                                                                  return acc + item[0];
                                                              }
                                                              return acc;
                                                          }, '');
                                                          setTranslatedText(combinedText)
                                                      }

                                                  } else {
                                                      setTranslateError(true)
                                                  }
                                              }}
                                >
                                    Translate
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Copy" showDivider={isPostMine}>
                                <DropdownItem key="json" startContent={<FontAwesomeIcon icon={faCode} />}
                                >
                                    JSON
                                </DropdownItem>
                                <DropdownItem key="uri" startContent={<FontAwesomeIcon icon={faU} />}
                                >
                                    Post URI
                                </DropdownItem>
                                <DropdownItem key="did" startContent={<FontAwesomeIcon icon={faUser} />}
                                >
                                    Author DID
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Danger zone">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<FontAwesomeIcon icon={faTrash} />}
                                >
                                    Delete post
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </main>
  );
}

export default PostOnlyPage;