import React, {useState, useRef, useCallback} from "react";
import { createPostPage } from "./styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faCirclePlus, faXmark, faPen, faFaceLaughBeam, faLink } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useDropzone, FileWithPath } from 'react-dropzone'
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

import Textarea from 'react-textarea-autosize'; // 追加

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
    const [PostContentLanguage, setPostContentLanguage] = useState(new Set([navigator.language]))
    const inputId = Math.random().toString(32).substring(2)
    const [contentText, setContentText] = useState("");
    const [contentImage, setContentImages] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const hiddenInput = useRef<HTMLDivElement>(null)
    const [isDetectedURL, setIsDetectURL] = useState(false)
    const [detectedURLs, setDetectURLs] = useState<string[]>([])
    const [selectedURL, setSelectedURL] = useState<string>('')
    const [isOGPGetProcessing, setIsOGPGetProcessing] = useState(false)
    const [isSetURLCard, setIsSetURLCard] = useState(false)
    const [getOGPData, setGetOGPData] = useState<any>(null)
    const [isGetOGPFetchError, setIsGetOGPFetchError] = useState(false)
    const isImageMaxLimited =
        contentImage.length >= 5 || contentImage.length === 4 // 4枚まで
    const isImageMinLimited = contentImage.length === 0 // 4枚まで
    const [compressProcessing, setCompressProcessing] = useState(false)
    const { background, backgroundColor,
            PostModal,
            header, headerTitle, headerPostButton, headerCancelButton,
            content, contentLeft, contentLeftAuthorIcon, contentLeftAuthorIconImage,
                     contentRight, contentRightContainer, contentRightTextArea, contentRightImagesContainer, contentRightUrlsContainer,
                     contentRightUrlCard, contentRightUrlCardDeleteButton,
                     URLCard, URLCardThumbnail, URLCardDetail, URLCardDetailContent, URLCardTitle, URLCardDescription, URLCardLink,
            footer, footerTooltip,
                    footerCharacterCount, footerCharacterCountText, footerCharacterCountCircle,
                    footerTooltipStyle,
    } = createPostPage();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();


    const onDrop = useCallback(async (files: File[]) => {
        if(contentImage.length + files.length > 4){
            return
        }
        const maxFileSize = 975 * 1024; // 975KB


        const compressedImages = await Promise.all(
            Array.from(files).map(async (file) => {
                if (file.size > maxFileSize) {
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

        // 5. 圧縮されたファイルをsetContentImagesで設定する
    }, []);
    const { getRootProps, isDragActive} = useDropzone({ onDrop });
    //const filesUpdated: FileWithPath[] = acceptedFiles;
    const handleDrop = (e:any) => {
        e.preventDefault();
        //const file = e.dataTransfer.files[0];
        // ファイルの処理を行う
    };

    const handleDragOver = (e:any) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

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

    const AppearanceColor = color
    const onEmojiClick = (event: any) => {
        if (textareaRef.current) {
            const target = textareaRef.current
            const cursorPosition = target.selectionStart
            const content = `${contentText.slice(0, cursorPosition)}${
                event.native
            }${contentText.slice(cursorPosition, contentText.length)}`
            setContentText(content)
        } else {
            setContentText(contentText + event.native)
        }
    }

    // ドラッグをキャンセルする
    const handleDragStart = (e:any) => {
        e.preventDefault();
    };

    const userList = [
        { name: 'John Doe', avatar: 'https://i.pravatar.cc/100?img=1', did: 'did:plc:txandrhc7afdozk6a2itgltm' },
        { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/100?img=2', did: 'did:plc:txandrhc7afdozk6a2itgltm'},
        { name: 'Kate Doe', avatar: 'https://i.pravatar.cc/100?img=3', did: 'did:plc:txandrhc7afdozk6a2itgltm'},
        { name: 'Mark Doe', avatar: 'https://i.pravatar.cc/100?img=4', did: 'did:plc:txandrhc7afdozk6a2itgltm'},
    ]

    const detectURL = (text: string) => {
        // URLを検出する正規表現パターン
        const urlPattern = /(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
        const urls = text.match(urlPattern);
        setDetectURLs([]);

        if (urls && urls.length > 0) {
            setIsDetectURL(true);
            urls.forEach((url) => {
                setDetectURLs((prevURLs) => [...prevURLs, url]);
                console.log(url)
            });
        }
    };
    const getOGP = async (url: string) => {
        console.log(url)
        setIsOGPGetProcessing(true)
        try{
            const response = await fetch(`https://ucho-ten-ogp-api.vercel.app/api/ogp?url=`+url)
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            const res = await response.json()
            setGetOGPData(res)
            console.log(res)
            setIsOGPGetProcessing(false)
            return res
        }catch (e) {
            setIsOGPGetProcessing(false)
            setIsSetURLCard(false)
            setIsGetOGPFetchError(true)
            console.log(e)
            return e
        }
    }

  return (
      <main className={background({color:AppearanceColor, isMobile:isMobile})}>
          <div className={backgroundColor()}></div>
          {isOpen && (
              window.prompt("Please enter link", "Harry Potter")
          )}
          <div className={PostModal({color:AppearanceColor, isMobile:isMobile})}>
              <div className={header()}>
                  <Button
                      variant="light"
                      className={headerCancelButton()}
                      isDisabled={loading}
                  >
                      cancel
                  </Button>
                  <div className={headerTitle()}>Post</div>
                  <Button className={headerPostButton()}
                          radius={'full'}
                          color={'primary'}
                          onPress={handlePostClick}
                          isDisabled={loading || contentText.length === 0 || contentText.length > 300 || isImageMaxLimited}
                          isLoading={loading}
                  >
                      {loading ? '' : 'send'}
                  </Button>
              </div>
              <div className={content({isDragActive:isDragActive})} {...getRootProps({ onDrop: handleDrop, onDragOver: handleDragOver })}>
                  <div className={contentLeft()}>
                      <div className={contentLeftAuthorIcon()}>
                          <Dropdown placement="right-start">
                              <DropdownTrigger>
                                  <img className={contentLeftAuthorIconImage()}
                                       alt={"author icon"}
                                       onDragStart={handleDragStart}
                                       src={"https://av-cdn.bsky.app/img/avatar/plain/did:plc:txandrhc7afdozk6a2itgltm/bafkreihwad5kaujw2f6kbfg37zmkhclgd3ap7grixl6pusfb5b34s6jite@jpeg"}
                                  ></img>
                              </DropdownTrigger>
                              <DropdownMenu>
                                  <DropdownSection title='accounts'>
                                      {userList.map((user, index) => (
                                          <DropdownItem
                                              key={index}
                                              description={user["did"]}
                                              startContent={<img style={{height: '30px', width: '30px'}} src={user["avatar"]} />}
                                          >{user["name"]}</DropdownItem>
                                      ))}
                                  </DropdownSection>
                              </DropdownMenu>
                          </Dropdown>
                      </div>
                  </div>
                  <div className={contentRight()}>
                      <Textarea className={contentRightTextArea()}
                                aria-label="post input area"
                                placeholder={"Yo, Do you do Brusco?"}
                                rows={contentText.split('\n').length}
                                maxLength={10000}
                                value={contentText}
                                autoFocus={true}
                                minRows={3}
                                onChange={(e) => {
                                    if (hiddenInput.current) hiddenInput.current.textContent = e.target.value + '\u200b'
                                    setContentText(e.target.value)
                                    detectURL(e.target.value)
                                }}
                                disabled={loading}
                                onFocus={(e)=>e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                      />
                      {contentImage.length > 0 && (
                          <div className={contentRightImagesContainer()}>
                              {contentImage.map((image, index) => (
                                  <div key={index} className={"relative w-1/4 h-full flex"}>
                                      <Image
                                          src={URL.createObjectURL(image)}
                                          alt="image"
                                          style={{borderRadius:'10px', objectFit:'cover'}}
                                          className={"h-[105px] w-[95px] object-cover object-center"}
                                      />
                                      <div style={{ zIndex:'10', position: 'absolute', top: 5, left: 5 }}>
                                          <button
                                              style={{
                                                  height: '20px',
                                                  width: '20px',
                                                  padding: '0px',
                                                  borderRadius: '50%',
                                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                              }}
                                              onClick={() => handleOnRemoveImage(index)}
                                          >
                                              <FontAwesomeIcon icon={faXmark} size="sm" className={' mb-[2px]'}/>
                                          </button>
                                      </div>
                                      <div style={{ zIndex:'10', position: 'absolute', bottom: 5, left: 5 }}>
                                          <button
                                              style={{
                                                  height: '20px',
                                                  width: '100%',
                                                  padding: '0px',
                                                  borderRadius: '12.5%',
                                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                              }}
                                              onClick={() => handleOnRemoveImage(index)}
                                          >
                                              ALT
                                          </button>
                                      </div>
                                      <div style={{ zIndex:'10', position: 'absolute', bottom: 5, right: '20px' }}>
                                          <button
                                              style={{
                                                  height: '20px',
                                                  width: '20px',
                                                  padding: '0px',
                                                  borderRadius: '50%',
                                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                              }}
                                              onClick={() => handleOnRemoveImage(index)}
                                          >
                                              <FontAwesomeIcon icon={faPen} size="sm" className={' mb-[2px]'}/>
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                      {isDetectedURL && !isSetURLCard && contentImage.length == 0 && (
                          <div style={{overflowX:'scroll'}}>
                              <div style={{textAlign:'left', }}
                                   className={contentRightUrlsContainer()}
                              >
                                  {detectedURLs.map((url, index) => (
                                      <button
                                          style={{
                                              flex: '0 1 calc(100%)',
                                              boxSizing: 'border-box',
                                              textOverflow: 'ellipsis',
                                              overflow: 'hidden',
                                              whiteSpace: 'nowrap',
                                              textAlign:'left',
                                              marginRight:'10px',
                                          }}
                                          onClick={() => {
                                               setIsSetURLCard(true)
                                               setIsGetOGPFetchError(false)
                                               setSelectedURL(url)
                                               getOGP(url)
                                               }
                                          }
                                          key={index}
                                      >Add: {url}</button>
                                  ))}
                              </div>
                          </div>
                      )}
                      {isOGPGetProcessing && (
                          <div className={contentRightUrlCard()}>
                              <div className={contentRightUrlCardDeleteButton()}>
                              </div>
                              <div>
                                  <div onClick={() => {
                                      setIsSetURLCard(false)
                                      setGetOGPData(undefined)
                                  }}
                                           style={{textAlign:'left', cursor:'pointer'}}
                                  >
                                      <div className={URLCardThumbnail()}>
                                          <div style={{position: "relative", textAlign: "center",
                                              top: "50%",
                                              left: '50%',
                                              transform: "translateY(-50%) translateX(-50%)",
                                              WebkitTransform: "translateY(-50%) translateX(-50%)"}}>
                                              <Spinner color="white" size="md" />
                                          </div>
                                      </div>
                                      <div className={URLCardDetail()}>
                                          <div className={URLCardDetailContent()}>
                                              <div className={URLCardTitle()} style={{ color: 'black' }}>
                                                  {undefined}
                                              </div>
                                              <div className={URLCardDescription()} style={{ fontSize: 'small' }}>
                                                  <div style={{textAlign:'center'}}>
                                                      <Spinner color="white" size="md" />
                                                  </div>
                                              </div>
                                              <div className={URLCardLink()}>
                                                  {undefined}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                      {isSetURLCard && getOGPData && !isOGPGetProcessing && (
                          <div className={contentRightUrlCard()}>
                              <div className={contentRightUrlCardDeleteButton()}
                                    onClick={() => {
                                        setIsSetURLCard(false)
                                        setGetOGPData(undefined)
                                    }}
                              >
                                  <div style={{width:'100%', textAlign:'center', marginTop:'50%'}}>
                                      <div className={'text-red'}>
                                          <FontAwesomeIcon icon={faTrashCan} size='lg'/>
                                      </div>
                                  </div>
                              </div>
                              <div>
                                  <div className={URLCard()}
                                      style={{textAlign:'left', cursor:'pointer'}}
                                  >
                                      <div className={URLCardThumbnail()}>
                                          <img
                                              src={getOGPData?.image ? getOGPData?.image : undefined}
                                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                              alt={getOGPData?.title && getOGPData?.image ? getOGPData.title : undefined}
                                          ></img>
                                      </div>
                                      <div className={URLCardDetail()}>
                                          <div className={URLCardDetailContent()}>
                                              <div className={URLCardTitle()} style={{ color: 'black' }}>
                                                  {getOGPData?.title ? getOGPData.title : selectedURL}
                                              </div>
                                              <div className={URLCardDescription()} style={{ fontSize: 'small' }}>
                                                  {getOGPData?.description ? getOGPData.description : "Sorry, no description available."}
                                              </div>
                                              <div className={URLCardLink()}>
                                                  {getOGPData?.url ? getOGPData.url : selectedURL}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
              <div className={footer({color:AppearanceColor})}>
                  <div className={footerTooltip()}>
                      <div className={footerTooltipStyle()}>
                          <label htmlFor={inputId}>
                              <Button
                                  as='span'
                                  isIconOnly
                                  variant="light"
                                  className={'h-[24px] text-white'}
                                  isDisabled={loading || compressProcessing || isImageMaxLimited}
                              >
                                  <FontAwesomeIcon icon={faImage} className={'h-[20px] mb-[5px]'}/>
                              </Button>
                              <input
                                  hidden multiple
                                  type="file" accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.tiff,.avif,.heic,.heif"
                                  id={inputId}
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
                                  {`lang:${Array.from(PostContentLanguage).join(",")}`}
                              </DropdownTrigger>
                              <DropdownMenu
                                  disallowEmptySelection
                                  aria-label="Multiple selection actions"
                                  selectionMode="multiple"
                                  selectedKeys={PostContentLanguage}
                                  onSelectionChange={(e) => {
                                      if (Array.from(e).length < 4) {
                                          setPostContentLanguage(e as Set<string>);
                                      }
                                  }}
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
                      <div className={footerTooltipStyle()}>
                          <Dropdown backdrop="blur">
                              <DropdownTrigger>
                                  <FontAwesomeIcon icon={faCirclePlus} className={'h-[20px] mb-[4px] text-white'}/>
                              </DropdownTrigger>
                              <DropdownMenu
                                  disallowEmptySelection
                                  aria-label="Multiple selection actions"
                                  selectionMode="multiple"
                                  selectedKeys={PostContentLanguage}
                                  onSelectionChange={(e) => {
                                      if (Array.from(e).length < 4) {
                                          //setPostContentLanguage(e as Set<string>);
                                      }
                                  }}
                              >
                                  <DropdownItem key='split'>文章を複数のポストに分割する</DropdownItem>
                                  <DropdownItem
                                      key='linkcard'
                                      onPress={() => {
                                            window.prompt("Please enter link", "")
                                      }
                                  }>リンクカードを追加する</DropdownItem>
                                  <DropdownItem key='de'>Deutsch</DropdownItem>
                                  <DropdownItem key='it'>Italiano</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
                      </div>
                      <BrowserView>
                          <div className={footerTooltipStyle()}>
                              <Popover placement="right-end">
                                  <PopoverTrigger>
                                      <Button
                                          isIconOnly
                                          variant="light"
                                          className={'h-[24px] text-white'}
                                      >
                                          <FontAwesomeIcon icon={faFaceLaughBeam} className={'h-[20px] mb-[4px]'}/>
                                      </Button>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                      <Picker
                                          data={data}
                                          onEmojiSelect={onEmojiClick}
                                          theme={color}
                                          previewPosition="none"
                                      />
                                  </PopoverContent>
                              </Popover>
                          </div>
                      </BrowserView>
                      <div className={footerCharacterCount()}>
                          <div className={footerCharacterCountText()} style={{color:contentText.length >= 300 ? "red": 'white'}}>{300 - contentText.length}</div>
                          <div style={{width:'20px', height:'20px', marginLeft:'5px'}}>
                              <CircularProgressbar
                                  value={contentText.length} maxValue={300}
                                  styles={buildStyles({pathColor:contentText.length >= 300 ? "red" : "deepskyblue",})}
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </main>
  );
}

export default CreatePostPage;