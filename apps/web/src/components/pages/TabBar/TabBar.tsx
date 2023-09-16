import React, {useState, useRef, useCallback} from "react";
import { tabBar } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faHome, faSearch, faInbox, faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button
} from "@nextui-org/react";

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
    uploadImageAvailable?: boolean
    isDragActive?: boolean
    open?: boolean
    selected: 'home' | 'search' | 'inbox' | 'post'
}
export const TabBar: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile, uploadImageAvailable, open, selected} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [selectedTab, setSelectedTab] = useState<'home' | 'search' | 'inbox' | 'post'>('home');
    const { TabBar, Container, Icon,
    } = tabBar();

  return (
      <main className={TabBar({color:color, isMobile:isMobile})}>
          <div className={Container({selected:selected==='home'})}
               onClick={() => {
                    setSelectedTab('home')
               }}
          >
              <FontAwesomeIcon icon={faHome} className={Icon({color:color, selected:selected})}/>
          </div>
          <div className={Container({selected:selected==='search'})}
               onClick={() => {
                   setSelectedTab('search')
               }}
          >
                <FontAwesomeIcon icon={faSearch} className={Icon({color:color, selected:selected})}/>
          </div>
          <div className={Container({selected:selected==='inbox'})}
               onClick={() => {
                   setSelectedTab('inbox')
               }}
          >
                <FontAwesomeIcon icon={faInbox} className={Icon({color:color, selected:selected})}/>
          </div>
          <div className={Container({selected:selected==='post'})}
               onClick={() => {
                   setSelectedTab('post')
               }}
          >
                <FontAwesomeIcon icon={faPenToSquare} className={Icon({color:color, selected:selected})}/>
          </div>
      </main>
  );
}

export default TabBar;