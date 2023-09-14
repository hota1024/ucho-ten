import React, {useState, useRef, useCallback} from "react";
import { postOnlyPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faComment, faSquare as faRegularSquare, faBookmark as faRegularBookmark} from '@fortawesome/free-regular-svg-icons'
import { faRetweet, faSquare as faSolidSquare, faBookmark as faSolidBookmark, faEllipsis } from '@fortawesome/free-solid-svg-icons'
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

}
export const PostOnlyPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, uploadImageAvailable, open,
           isLiked, isReposted, isBookmarked
    } = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)

    const { background, Container,AuthorPost,Author, AuthorIcon, AuthorDisplayName,AuthorHandle,PostContent,PostCreatedAt,ReactionButtonContainer,ReactionButton,
    } = postOnlyPage();

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
                                <DropdownItem>削除</DropdownItem>
                                <DropdownItem>編集</DropdownItem>
                                <DropdownItem>通報</DropdownItem>
                            </DropdownMenu>
                      </Dropdown>
                  </div>
              </div>
          </div>
      </main>
  );
}

export default PostOnlyPage;