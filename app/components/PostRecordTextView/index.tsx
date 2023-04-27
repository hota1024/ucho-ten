import {
  FeedViewPost,
  PostView,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Entity,
  Record,
} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import React, { ReactNode } from 'react'
import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import { ViewRecord } from '@atproto/api/dist/client/types/app/bsky/embed/record'
import { AppBskyFeedPost } from '@atproto/api'
import parse from 'html-react-parser'

interface PostRecordTextViewProps {
  record: Record
}

export const PostRecordTextView = (props: PostRecordTextViewProps) => {
  const { record } = props
  let elements: ReactNode[] = []

  function getByteLength(str: string): number {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        byteLength += 1;
      } else if (charCode <= 0x07ff) {
        byteLength += 2;
      } else if (charCode <= 0xffff) {
        byteLength += 3;
      } else if (charCode <= 0x1fffff) {
        byteLength += 4;
      } else if (charCode <= 0x1fffff) {
        byteLength += 5;
      } else if (charCode <= 0x7fffffff) {
        byteLength += 6;
      }
    }
    return byteLength;
  }
  function extractTextByByteRange(json:any) {
    const text: string = json.text;
    const facets: any[] = json.facets;
    let replacedText: string = text;
    for (let i = 0; i < facets.length; i++) {
      const byteStart: number = facets[i].index.byteStart;
      const byteEnd: number = facets[i].index.byteEnd;
      let charCount = 0;
      let extractedText = "";
      for (let j = 0; j < text.length; j++) {
        const charCode = text.charCodeAt(j);
        const charByteLength = charCode <= 0x007f ? 1 : charCode <= 0x07ff ? 2 : charCode <= 0xffff ? 3 : charCode <= 0x1fffff ? 4 : charCode <= 0x3ffffff ? 5 : charCode <= 0x7fffffff ? 6 : 0;
        if (charCount >= byteStart && charCount < byteEnd) {
          extractedText += text.charAt(j);
        }
        charCount += charByteLength;
      }
      const regex = new RegExp(extractedText, 'g');
      console.log(extractedText)
      if(extractedText.slice(0,1) === '@'){
        console.log('@')
        replacedText = replacedText.replace(regex, `<Link href="/profile/${extractedText.slice(1)}">${extractedText}</Link>`);
      }else{
        console.log('https')
        replacedText = replacedText.replace(regex, `<a href="${extractedText}" target="_blank" rel="noopener noreferrer">${extractedText}</a>`);
      }
    }
    return replacedText;
  }

  if (record.facets && record.facets.length > 0) {
    // facetsがある場合にのみ処理する
    const text = record.text
    const replacedText = extractTextByByteRange(record)
    console.log(replacedText)


    let i = 0
    elements.push(
        //parse(replacedText)
        <>
            {replacedText.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {parse(line)}
                    <br />
                </React.Fragment>
            ))}
        </>
    )
  } else if (record.entities && record.entities.length > 0) {
    // entitiesがある場合にのみ処理する
    const text = record.text
    let i = 0
    for (const entity of record.entities) {
      const { start, end } = entity.index
      // URLにaタグまたはlinkタグを追加
      if (entity.type === 'app.bsky.richtext.entity#mention') {
        elements.push(
          <Link href={`/profile/${text.slice(start + 1, end)}`}>
            {text.slice(start, end)}
          </Link>
        )
      } else if (entity.type === 'link') {
        elements.push(
          <a href={text.slice(start, end)} target="_blank" rel="noopener noreferrer">{text.slice(start, end)}</a>
        )
      }
      // URL以外のテキストを追加
      // elements.push(<>{text.slice(end)}</>)

      let sliced_sentence = text.slice(end)
      elements.push(
        <>
          {sliced_sentence.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </>
      )
      i = end
    }
  } else {
    let sliced_sentence = record.text
    elements.push(
      <>
        {sliced_sentence.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </>
    )
  }

  elements = elements.map((el, key) => (
    <React.Fragment key={key}>{el}</React.Fragment>
  ))

  return <div style={{wordBreak: "break-all"}}>{elements}</div>
}
