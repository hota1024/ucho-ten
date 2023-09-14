import React, {useState, useRef, useCallback} from "react";
import { postOnlyPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faComment, faSquare as faRegularSquare, faBookmark as faRegularBookmark, } from '@fortawesome/free-regular-svg-icons'
import { faRetweet, faSquare as faSolidSquare, faBookmark as faSolidBookmark, faEllipsis, faArrowUpFromBracket, faTrash, faFlag, faCode, faUser, faU, faLanguage} from '@fortawesome/free-solid-svg-icons'
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

    const { background, Container,AuthorPost,Author, AuthorIcon, AuthorDisplayName,AuthorHandle,PostContent,PostCreatedAt,ReactionButtonContainer,ReactionButton,
    } = postOnlyPage();

  // @ts-ignore
    // @ts-ignore
    return (
      <main className={background({color:color, isMobile:isMobile})}>
          <div className={Container({color:color})}>
              <div className={AuthorPost()}>
                  <div className={Author()}>
                      <div className={AuthorIcon()}></div>
                      <div>
                          <div className={AuthorDisplayName()}>ばいそに</div>
                          <div className={AuthorHandle()}>@bisn.ucho-ten.net</div>
                      </div>
                  </div>
                  <div className={PostContent()}>
                      <div>
                          親譲の無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰こしを抜ぬかした事がある。なぜそんな無闇むやみをしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張いばっても、そこから飛び降りる事は出来まい。弱虫やーい。と囃たからである。小使に負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。
                      </div>
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
                      <FontAwesomeIcon icon={faRetweet} className={ReactionButton()}></FontAwesomeIcon>
                      <FontAwesomeIcon icon={!isLiked ? faRegularSquare : faSolidSquare} className={ReactionButton()}></FontAwesomeIcon>
                      <FontAwesomeIcon icon={!isBookmarked ? faRegularBookmark: faSolidBookmark} className={ReactionButton()}></FontAwesomeIcon>
                      <Dropdown>
                            <DropdownTrigger>
                                <FontAwesomeIcon icon={faEllipsis} className={ReactionButton()}/>
                            </DropdownTrigger>
                            <DropdownMenu>
                                {/*@ts-ignore*/}
                                <DropdownSection title="Actions" showDivider>
                                    {!isPostMine && (
                                        <DropdownItem key="new"
                                                      startContent={<FontAwesomeIcon icon={faFlag} />}
                                        >
                                            Report
                                        </DropdownItem>
                                    )}
                                    <DropdownItem key="copy"
                                                  startContent={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
                                    >
                                        Share
                                    </DropdownItem>
                                    <DropdownItem key="copy"
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
                                                                console.log(combinedText)
                                                          }

                                                      } else {
                                                          setTranslateError(true)
                                                      }
                                                      //console.log(await res.json())
                                                      //setTranslatedText()
                                                  }}
                                    >
                                        Translate
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection title="Copy" showDivider={isPostMine}>
                                    <DropdownItem key="copy" startContent={<FontAwesomeIcon icon={faCode} />}
                                    >
                                        JSON
                                    </DropdownItem>
                                    <DropdownItem key="copy" startContent={<FontAwesomeIcon icon={faU} />}
                                    >
                                        Post URI
                                    </DropdownItem>
                                    <DropdownItem key="copy" startContent={<FontAwesomeIcon icon={faUser} />}
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
          </div>
      </main>
  );
}

export default PostOnlyPage;