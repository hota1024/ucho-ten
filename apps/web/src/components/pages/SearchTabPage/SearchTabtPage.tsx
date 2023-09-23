import React, {useState, useRef, useCallback} from "react";
import { searchTabPage } from "./styles";
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


interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
}
export const SearchTabtPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile,} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const { background, Container, RecommendContainer, FeedCard, FeedCardIcon, FeedTitle, FeedCreator,
    } = searchTabPage();

  return (
      <main className={''}>
          <div className={Container()}>
              <div className={RecommendContainer()}>
                  <div>他ユーザーを見つけよう</div>
                  <div className={FeedCard({color:color})}>
                      <div className={FeedCardIcon()}></div>
                      <div>
                          <div className={FeedTitle({color:color})}>Japanese Cluster</div>
                          <div className={FeedCreator({color:color})}>by @jaz.bsky.social</div>
                      </div>
                  </div>
                  <div className={FeedCard({color:color})}>
                      <div className={FeedCardIcon()}></div>
                      <div>
                          <div className={FeedTitle({color:color})}>English Cluster</div>
                          <div className={FeedCreator({color:color})}>by @jaz.bsky.social</div>
                      </div>
                  </div>
                  <div className={FeedCard({color:color})}>
                      <div className={FeedCardIcon()}></div>
                      <div>
                          <div className={FeedTitle({color:color})}>Korean Cluster</div>
                          <div className={FeedCreator({color:color})}>by @jaz.bsky.social</div>
                      </div>
                  </div>
              </div>
          </div>
      </main>
  );
}

export default SearchTabtPage;