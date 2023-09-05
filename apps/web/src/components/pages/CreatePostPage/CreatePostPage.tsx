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
            Content,
            Footer, FooterBackgroundColor } = createPostPage();

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
          <div className={Container()} style={{backgroundColor:'rgba(218, 218, 218, 0.68)'}}>
              <div className={Footer()}>
                  <div className={FooterBackgroundColor()} />
                  <div className="Plusbuton left-[168px] top-[397px] absolute text-white text-xl font-black">
                      <FontAwesomeIcon icon={faCirclePlus}/>
                  </div>
                  <div className="AddImageButton left-[36px] top-[395px] absolute text-white text-2xl font-normal">
                      <label htmlFor={inputId}>
                          <Button
                              disabled={loading || compressProcessing || isImageMaxLimited}
                              as="span"
                              startContent={<FontAwesomeIcon icon={faImage} />}
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
                  <div className="Lang left-[96px] top-[400px] absolute text-white text-base font-bold">
                      <Dropdown backdrop="blur">
                          <DropdownTrigger>
                              <Button
                                variant="bordered"
                              >
                                  {PostContentLanguage.size === 1 ? PostContentLanguage : "Langs"}
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
                  <div className=" w-14 h-5 left-[315px] top-[398px] absolute">
                      <div className=" left-0 top-[4px] absolute text-white text-sm">
                          {300 - contentText.length}
                      </div>
                      <div className="Ellipse1 w-5 h-5 left-[34px] top-[1px] absolute bg-zinc-300 rounded-full" >
                          <CircularProgressbar maxValue={300} value={contentText.length} background={true}/>
                      </div>
                  </div>
              </div>
              <div className={Content()}>
                  {contentImage.length > 0 && (
                      <div className="Footer w-96 h-28 left-0 top-[233px] absolute">
                          <div className=" w-96 h-20 left-[13px] top-[10px] absolute">
                              {contentImage.map((image, index) => (
                                  <div className={` w-20 h-20 left-[${index * 93}px] top-0 absolute bg-zinc-300 rounded-lg overflow-hidden `}>
                                      <Image
                                          src={URL.createObjectURL(image)}
                                          alt="preview"
                                          style={{
                                              width: `100%`,
                                              height: '85px',
                                              objectFit: 'cover',
                                          }}
                                      ></Image>
                                      <div style={{ zIndex:10, position: 'absolute', top: 0, right: 0 }}>
                                          <Button
                                              className={" w-[24px]"}
                                              style={{
                                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                              }}
                                              onClick={() => handleOnRemoveImage(index)}
                                              startContent={<FontAwesomeIcon className=" text-white" icon={faXmark} size="lg" />}
                                              radius={"full"}
                                          >
                                          </Button>
                                      </div>
                                      <div style={{ zIndex:10, position: 'absolute', bottom: 0, right: 0 }}>
                                          <Button
                                              className={" w-[24px]"}
                                              style={{
                                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                              }}
                                              onClick={() => handleOnRemoveImage(index)}
                                              radius={"full"}
                                          >ALT
                                          </Button>
                                      </div>
                                      <div style={{ zIndex:10, position: 'absolute', bottom: 0, left: 0 }}>
                                          <Button
                                              style={{
                                                  width:'24px',
                                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                              }}
                                              onClick={() => handleOnRemoveImage(index)}
                                              startContent={<FontAwesomeIcon className=" text-white" icon={faPen} size="lg" />}
                                              radius={"full"}
                                          >
                                          </Button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  <div className={`Textarea w-80 h-${contentImage.length > 0 ? 56 : "full"} left-[53px] top-0 absolute`}>
                      <textarea className="Yo w-full h-full left-0 top-0 absolute text-black font-medium"
                                style={{backgroundColor:'transparent', resize:'none', outline: 'none'}}
                                placeholder={"Yo, Do you Brusco?"}
                                autoFocus={true}
                                onChange={(e) => {
                                    setContentText(e.target.value)
                                }}/>
                  </div>
                  <div className=" w-14 h-56 left-0 top-0 absolute">
                      <div className=" w-7 h-7 left-[11px] top-0 absolute bg-zinc-300 rounded-lg" />
                      <img className="Bafkreihwad5kaujw2f6kbfg37zmkhclgd3ap7grixl6pusfb5b34s6jite11 w-7 h-7 left-[11px] top-0 absolute rounded-lg" src="https://via.placeholder.com/30x30" />
                  </div>
              </div>
              <div className={Header()}>
                  <div className="PostButton w-24 h-9 right-[4px] top-[3px] absolute">
                      <Button
                          variant="shadow"
                          className="PostButton w-24 h-9 left-0 top-0 absolute rounded-3xl text-white text-sm font-medium"
                          style={{backgroundColor:'rgba(0, 130, 250, 1)'}}
                          onClick={handlePostClick}
                      >send</Button>
                  </div>
                  <div className={HeaderTitle()}>Post</div>
              </div>
          </div>
      </main>
  );
}
