import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import { useAgent } from '@/atoms/agent'
import { PostRecordPost } from '@/types/posts'
import { BlobRef, RichText } from '@atproto/api'
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Button,
  Card,
  Loading,
  Modal,
  Spacer,
  Text,
  Textarea,
  Image,
  Row,
  Col,
  Popover,
  styled, Dropdown,
} from '@nextui-org/react'
import { useRef, useState } from 'react'
import { Post } from '../Post/Post'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { faFaceSurprise } from '@fortawesome/free-solid-svg-icons'
import Zoom from 'react-medium-image-zoom'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import imageCompression from "browser-image-compression";
import { useDropzone, FileWithPath } from 'react-dropzone'
import { useCallback, useMemo } from 'react';
import { useTranslation } from "react-i18next";



const URLCard = styled('div', {
  height: '100px',
  width: '485px',
  borderRadius: ' 10px',
  overflow: 'hidden',
  border: '1px solid $gray600',
  display: 'flex',
  alignItems: 'center',
  color: '$gray800',
  '&:hover': {
    backgroundColor: '$gray200',
  }
})

const URLCardThumb = styled('div', {
  height: '100px',
  width: '100px',
  borderRight: '1px solid $gray600',
})
const URLCardDetail = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px',
  height: '100%',
  width: 'calc(100% - 110px)',
})
const URLCardDetailContent = styled('div', {
  hgiehgt: '100%',
  width: '370px',
  minWidth: "0",
})
const URLCardTitle = styled('div', {
  fontSize: '$sm',
  fontWeight: 'bold',
  color: '$gray800',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})
const URLCardDesc = styled('div', {
  fontSize: '$xs',
  color: '$gray700',
  marginTop: '$1',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

const URLCardLink = styled('div', {
  fontSize: '$xs',
  color: '$gray700',
  marginTop: '$1',
  '& a': {
    color: '$gray700',
    textDecoration: 'underline',
  },
})



const PostTextarea = styled('textarea', {
  background: '#efefef',
  border: '1px solid #eaeaea',
  borderRadius: '$sm',
  resize: 'none',
  padding: '1rem',
})

export interface PostModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (record: PostRecordPost) => void
  parentPostView?: PostView
  title: string
  submitText: string
}

export const PostModal = (props: PostModalProps) => {
  const { title, submitText, open, onClose, onSubmit, parentPostView } = props
  const [agent] = useAgent()
  const [contentText, setContentText] = useState<string>('')
  const [contentImage, setContentImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [compressProcessing, setCompressProcessing] = useState(false)

  const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
  const isPostable = contentText.length > 0 && !reg.test(contentText)
  const isContentLimitOver = contentText.length > 300
  const isImageMaxLimited =
    contentImage.length >= 5 || contentImage.length === 4 // 4枚まで
  const isImageMinLimited = contentImage.length === 0 // 4枚まで
  const inputId = Math.random().toString(32).substring(2)
  const [PostContentLanguage, setPostContentLanguage] = useState(new Set([navigator.language]))
  const [isDetectURL, setIsDetectURL] = useState(false)
  const [detectURLs, setDetectURLs] = useState<string[]>([])
  const [isSettingURLCard, setIsSettingURLCard] = useState(false)
  const { t, i18n } = useTranslation()


  const handlePostClick = async () => {
    if (!agent) {
      throw new Error('agent is not ready')
    }

    setLoading(true)

    const blobs: BlobRef[] = []
    for (const file of contentImage) {
      const binary = new Uint8Array(await file.arrayBuffer())
      const result = await agent.uploadBlob(binary, {
        encoding: file.type,
      })

      blobs.push(result.data.blob)
    }

    const images = blobs.map((blob, key) => ({
      image: blob,
      alt: `image${key + 1}`,
    }))

    const rt = new RichText({ text: contentText })
    await rt.detectFacets(agent)

    await onSubmit({
      text: rt.text.trimStart().trimEnd(),
      facets: rt.facets,
      langs: Array.from(PostContentLanguage),
      embed:
        blobs.length > 0
          ? {
              $type: 'app.bsky.embed.images',
              images,
            }
          : undefined,
    })

    setLoading(false)
    onClose()
    setContentText('')
    setContentImages([])
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handlePostClick()
    }
  }

  const handleOnAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const compressedImages = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          if (file.size > 975000) {
            try {
              setCompressProcessing(true)
              const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.975,
                maxWidthOrHeight: 1920,
              });
              setCompressProcessing(false)

              return compressedFile;
            } catch (error) {
              console.error(error);
              return file;
            }
          } else {
            return file;
          }
        })
    );

    setContentImages((b) => [...b, ...compressedImages]);
  };

  const handleOnRemoveImage = (index: number) => {
    // 選択した画像は削除可能
    const newImages = [...contentImage]
    newImages.splice(index, 1)
    setContentImages(newImages)
  }

  const onEmojiClick = (event: any, emojiObject: any) => {
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

  const handleDrop = (e:any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    // ファイルの処理を行う
  };

  const handleDragOver = (e:any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDrop = useCallback(async (files: File[]) => {
    const maxFileSize = 975 * 1024; // 975KB
    const compressedFiles = [];


    for (const file of files) {
      // 1. ファイルのサイズを確認する
      if (file.size > maxFileSize) {
        // 2. ファイルが画像かどうかを確認する
        if (file.type.includes('image')) {
          // 3. ファイルが975KB以上であるかどうかを確認する
          setCompressProcessing(true);
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.975, // 975KB
            useWebWorker: true,
          });
          compressedFiles.push(compressedFile);
          setCompressProcessing(false);
        } else {
          compressedFiles.push(file);
        }
      } else {
        compressedFiles.push(file);
      }
    }

    // 5. 圧縮されたファイルをsetContentImagesで設定する
    setContentImages(compressedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop });
  const filesUpdated: FileWithPath[] = acceptedFiles;
  //一部環境でtextareaをクリックしたときに画像添付ファイらーが出るのを防止
  const handleTextareaClick = (e:any) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const detectURL = (text: string) => {
    // URLを検出する正規表現パターン
    const urlPattern = /((?:https?|ftp):\/\/)(?:[\w-]+(?:\.[\w-]+)+)(?:\/[\w-]+)*(?:\/|\/[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi
    const urls = text.match(urlPattern)
    setDetectURLs([])

    if (urls && urls.length > 0) {
      setIsDetectURL(true)
      urls.forEach((url) => {
        setDetectURLs(prevURLs => [...prevURLs, url])
      })
    }
  }

  const getOGP = async (url: string) => {
    //console.log(url)
  }

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      preventClose={loading}
      className="post-modal"
      width='600px'
      css={{left: '2%'}}
    >
      <Modal.Header>
        <Text size="$lg" b>
          {/* {parentPostView ? '返信する' : '投稿する'} */}
          {title}
        </Text>
      </Modal.Header>
      {parentPostView && (
        <Modal.Body>
          <Card variant="bordered">
            <Post
              record={parentPostView.record as Record}
              author={parentPostView.author}
              hideActions
              disableTooltip
            />
          </Card>
        </Modal.Body>
      )}
      <Modal.Body>
        <div style={{position: 'absolute', right:'45px', bottom:'0px'}}>
          {contentText.length > 300 &&(
                <Text color="red" size="$sm" b>
                  {300 - contentText.length}
                </Text>
          )}
          {contentText.length <= 300 &&(
              <Text size="$sm">{300 - contentText.length}</Text>
          )}
        </div>
        <div
            {...getRootProps({ onDrop: handleDrop, onDragOver: handleDragOver })}
        >
          <PostTextarea
              ref={textareaRef}
              aria-label="Text"
              placeholder={t("Modal.Post.PlaceHolder")}
              rows={8}
              maxLength={300}
              value={contentText}
              autoFocus={true}
              onChange={(e) => {
                setContentText(e.target.value)
                detectURL(e.target.value)
              }}
              disabled={loading}
              onKeyDown={isPostable ? handleKeyDown : undefined}
              onClick={handleTextareaClick}
              onFocus={(e)=>e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
              style={{border: isDragActive ? '2px dashed #000' : 'none', width:'100%', height:'100%'}}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {false && isDetectURL && !isSettingURLCard && (
            <div style={{textAlign:'left'}}>
              {detectURLs.map((url, index) => (
                  <Button onClick={() => {
                        setIsSettingURLCard(true)
                        getOGP(url)
                        }
                      }
                      key={index}
                      flat
                  >Add Linkcard: {url}</Button>
              ))}
            </div>
         )}
        {isSettingURLCard && false && (
            <div>
              <URLCard>
                <URLCardThumb>
                  <img
                      src={undefined}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      alt={undefined}
                  ></img>
                </URLCardThumb>
                <URLCardDetail>
                  <URLCardDetailContent>
                    <URLCardTitle style={{ color: 'black' }}>
                      {undefined}
                    </URLCardTitle>
                    <URLCardDesc style={{ fontSize: 'small' }}>
                      {undefined}
                    </URLCardDesc>
                    <URLCardLink>
                      {undefined}
                    </URLCardLink>
                  </URLCardDetailContent>
                </URLCardDetail>
              </URLCard>
            </div>
        )}
        {contentImage.length > 0 && (
          <Text size="$sm" color="error">
            {t("Modal.Post.CanUploadUpToNImagesFirstHalf")}{4 - contentImage.length}{t("Modal.Post.CanUploadUpToNImagesSecondHalf")}
          </Text>
        )}
        {compressProcessing && (
            <Text size="$sm">
              {t("Modal.Post.CompressingImage")}<Loading size="xs"/>
            </Text>
        )}
        {contentImage.length > 0 && (
          <div style={{ display: 'flex', width: '100%', height: '100px' }}>
            {contentImage.map((image, index) => (
              <div
                key={index}
                style={{
                  width: `calc(100% / 4)`,
                  height: '88px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Zoom>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    style={{
                      width: `100%`,
                      height: '88px',
                      objectFit: 'cover',
                    }}
                  ></Image>
                </Zoom>
                <div style={{ position: 'absolute', top: 0, left: 0 }}>
                  <Button
                    auto
                    css={{
                      height: '15px',
                      width: '15px',
                      padding: '0px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                    onClick={() => handleOnRemoveImage(index)}
                  >
                    <FontAwesomeIcon icon={faXmark} size="sm" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Row justify="space-between">
          <div>
            <Popover placement="left">
              <Popover.Trigger>
                <Button
                  as="span"
                  auto
                  light
                  icon={<FontAwesomeIcon icon={faFaceSurprise} size="lg" />}
                />
              </Popover.Trigger>
              <Popover.Content>
                <Picker
                  data={data}
                  onEmojiSelect={onEmojiClick}
                  style={{ width: '100%' }}
                  theme="light"
                  previewPosition="none"
                />
              </Popover.Content>
            </Popover>
          </div>
          <label htmlFor={inputId}>
            <Button
              disabled={loading || compressProcessing || isImageMaxLimited}
              as="span"
              auto
              light
              icon={<FontAwesomeIcon icon={faImage} size="lg" />}
            />

            <input
              hidden
              id={inputId}
              type="file"
              multiple
              accept="image/*,.png,.jpg,.jpeg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleOnAddImage(e)
              }
              disabled={loading || compressProcessing || isImageMaxLimited}
            />
          </label>
          <div>
            <Dropdown>
              <Dropdown.Button light css={{ tt: "capitalize" }}>
                {PostContentLanguage.size === 1 ? PostContentLanguage : "Langs"}
              </Dropdown.Button>
                <Dropdown.Menu
                    aria-label="Multiple selection actions"
                    selectionMode="multiple"
                    disallowEmptySelection
                    selectedKeys={PostContentLanguage}
                    //@ts-ignore
                    onSelectionChange={PostContentLanguage.size >= 3 ? null : setPostContentLanguage}
                >
                    <Dropdown.Item key='es'>Español</Dropdown.Item>
                    <Dropdown.Item key='fr'>Français</Dropdown.Item>
                    <Dropdown.Item key='de'>Deutsch</Dropdown.Item>
                    <Dropdown.Item key='it'>Italiano</Dropdown.Item>
                    <Dropdown.Item key='pt'>Português</Dropdown.Item>
                    <Dropdown.Item key='ru'>Русский</Dropdown.Item>
                    <Dropdown.Item key='zh'>中文</Dropdown.Item>
                    <Dropdown.Item key='ko'>한국어</Dropdown.Item>
                    <Dropdown.Item key='en'>English</Dropdown.Item>
                    <Dropdown.Item key='ja'>日本語</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button auto light onPress={onClose} disabled={loading}>
              {t("Modal.Post.Button.Cancel")}
            </Button>
            <Button
              auto
              onClick={handlePostClick}
              disabled={
                loading ||
                (!isPostable && isImageMinLimited) ||
                  compressProcessing || isContentLimitOver ||
                contentImage.length >= 5
              }
            >
              {loading ? (
                <>
                  <Loading size="xs" />
                  <Spacer x={0.5} />
                  Submitting...
                </>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </Row>
      </Modal.Footer>
    </Modal>
  )
}
