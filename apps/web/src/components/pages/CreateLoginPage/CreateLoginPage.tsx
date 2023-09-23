import {useState, useRef} from "react";
import { createLoginPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faLink, faLock, faUser, faList } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar } from 'react-circular-progressbar';
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
} from "@nextui-org/react";

export function CreateLoginPage() {
    const [loading, setLoading] = useState(false)
    const { background,
                LoginForm, LoginFormConnectServer,
                LoginFormHandle, LoginFormPassword,
                LoginFormLoginButton
          } = createLoginPage();

    return (
        <main className={background()}>
            <div className={LoginForm()}>
                <div className={LoginFormConnectServer()}>
                    <FontAwesomeIcon className={'ml-[4px] text-xl'} icon={faLink}/>
                    <FontAwesomeIcon className={"absolute right-[10px] text-xl"} icon={faList}/>
                    <input className={'h-full w-full bg-transparent ml-[12.5px] text-base font-bold outline-none'} placeholder={'bsky.social (default)'}></input>
                </div>
                <div className={LoginFormHandle()}>
                    <FontAwesomeIcon className={'ml-[8px] text-xl'} icon={faUser}/>
                    <input
                        type={'text'}
                        autoComplete={'username'}
                        onChange={(e) => {}}
                        className={'h-full w-full bg-transparent ml-[16.5px] text-base font-bold outline-none'} placeholder={'handle, did, e-mail'}></input>
                </div>
                <div className={LoginFormHandle()}>
                    <FontAwesomeIcon className={'ml-[8px] text-xl'} icon={faLock}/>
                    <input
                        type={'password'}
                        autoComplete={'current-password'}
                        className={'h-full w-full bg-transparent ml-[16.5px] text-base font-bold outline-none'} placeholder={'password'}></input>
                </div>
                <Button className={LoginFormLoginButton()}>
                    <div className="text-zinc-400 text-xl font-bold">Sign In</div>
                </Button>
            </div>
        </main>

    );
}