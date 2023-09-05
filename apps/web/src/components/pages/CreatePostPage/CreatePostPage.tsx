import React, {useState, useRef} from "react";
import { createPostPage } from "./styles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faCirclePlus, faXmark, faPen } from '@fortawesome/free-solid-svg-icons'
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
} from "@nextui-org/react";

export function CreatePostPage() {

    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [PostContentLanguage, setPostContentLanguage] = useState(new Set([navigator.language]))
    const inputId = Math.random().toString(32).substring(2)
    const [contentText, setContentText] = useState("");
    const [contentImage, setContentImages] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const isImageMaxLimited =
        contentImage.length >= 5 || contentImage.length === 4 // 4枚まで
    const isImageMinLimited = contentImage.length === 0 // 4枚まで
    const [compressProcessing, setCompressProcessing] = useState(false)
    const { Container,
            Header, HeaderPostButton, HeaderTitle,
            Content, ContentTextArea,
            Footer, FooterBackgroundColor,
            PostModal,
            header, headerTitle, headerPostButton,
            content, contentLeft, contentLeftAuthorIcon,
                     contentRight, contentRightTextArea, contentRightImagesContainer,
            footer, footerTooltip,
                    footerCharacterCount, footerCharacterCountText, footerCharacterCountCircle,
                    footerTooltipStyle,
    } = createPostPage();

    const handlePostClick = async () => {
        setLoading(true)

    }
    const handleOnRemoveImage = (index: number) => {
        const newImages = [...contentImage]
        newImages.splice(index, 1)
        setContentImages(newImages)
    }
    const handleOnAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const compressedImages = await Promise.all(
            Array.from(e.target.files).map(async (file) => {
                if (file.size > 975000) {
                    try {
                        setCompressProcessing(true)
                        const compressedFile = file
                        setCompressProcessing(false)

                        return compressedFile;
                    } catch (error) {
                        console.error(error);
                        return file
                    }
                } else {
                    return file;
                }
            })
        );

        setContentImages((b) => [...b, ...compressedImages]);
    };

  return (
      <main className={" w-full h-full"} style={{backgroundColor:'rgba(0, 0, 0, 0.33)', backgroundImage:'url(https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/light/sky_00421.jpg)'}}>
          <div className={PostModal()}>
              <div className={header()}>
                  <div className={headerTitle()}>Post</div>
                  <button className={headerPostButton()}>send</button>
              </div>
              <div className={content()}>
                  <div className={contentLeft()}>
                      <div className={contentLeftAuthorIcon()}>
                          <div style={{width:'100%', height:'100%', overflow:'hidden'}}></div>
                      </div>
                  </div>
                  <div className={contentRight()}>
                      <div className={`w-full ${contentImage.length > 0 ? "h-[calc(100%-105px)]" : "h-full"}`}>
                          <textarea className={contentRightTextArea()}
                                    style={{backgroundColor:'transparent', resize:'none', outline: 'none'}}
                                    placeholder={"Yo, Do you do Brusco?"}
                                    autoFocus={true}
                                    onChange={(e) => {
                                        setContentText(e.target.value)
                                    }}/>
                      </div>
                      {contentImage.length > 0 && (
                          <div className={contentRightImagesContainer()}>
                              {contentImage.map((image, index) => (
                                  <div key={index} className={"relative w-1/4 h-full"}>
                                      <Image
                                          src={URL.createObjectURL(image)}
                                          alt="image"
                                          style={{borderRadius:'10px', objectFit:'cover'}}
                                          className={"h-[85px] w-[85px] object-cover object-center"}
                                      />
                                      <div className={"z-10 absolute top-0 left-0"}>
                                          <button onClick={() => handleOnRemoveImage(index)}>
                                              <FontAwesomeIcon icon={faXmark} size={"sm"}></FontAwesomeIcon>
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
              <div className={footer()}>
                  <div className={footerTooltip()}>
                      <div className={footerTooltipStyle()}>
                          <label htmlFor={inputId}>
                              <Button
                                  disabled={loading || compressProcessing || isImageMaxLimited}
                                  as="span"
                                  startContent={<FontAwesomeIcon icon={faImage} style={{height:'100%'}}/>}
                              />

                              <input
                                  hidden
                                  id={inputId}
                                  type="file"
                                  multiple
                                  accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.tiff,.avif,.heic,.heif"
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                      handleOnAddImage(e)
                                  }
                                  disabled={loading || compressProcessing || isImageMaxLimited }
                              />
                          </label>
                      </div>
                      <div className={footerTooltipStyle()} style={{bottom:'5%'}}>
                          <Dropdown backdrop="blur">
                              <DropdownTrigger>
                                  <Button
                                      variant="bordered"
                                  >
                                      {PostContentLanguage}
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                  aria-label="Multiple selection actions"
                                  selectionMode="multiple"
                                  disallowEmptySelection
                                  selectedKeys={PostContentLanguage}
                                  //@ts-ignore
                                  onSelectionChange={PostContentLanguage.size >= 3 ? null : setPostContentLanguage}
                              >
                                  <DropdownItem key='es'>Espalier</DropdownItem>
                                  <DropdownItem key='fr'>Francais</DropdownItem>
                                  <DropdownItem key='de'>Deutsch</DropdownItem>
                                  <DropdownItem key='it'>Italiano</DropdownItem>
                                  <DropdownItem key='pt'>Portuguese</DropdownItem>
                                  <DropdownItem key='ru'>Русский</DropdownItem>
                                  <DropdownItem key='zh'>中文</DropdownItem>
                                  <DropdownItem key='ko'>한국어</DropdownItem>
                                  <DropdownItem key='en'>English</DropdownItem>
                                  <DropdownItem key='ja'>日本語</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
                      </div>
                      <FontAwesomeIcon className={footerTooltipStyle()} icon={faCirclePlus} size={"sm"}></FontAwesomeIcon>
                      <div className={footerCharacterCount()}>
                          <div className={footerCharacterCountText()} style={{color:contentText.length >= 300 ? "red": 'white'}}>{300 - contentText.length}</div>
                          <div style={{width:'20px', height:'20px', marginLeft:'5px'}}>
                              <CircularProgressbar value={contentText.length} maxValue={300} />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </main>
  );
}
