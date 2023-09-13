import React, {useState, useRef, useCallback} from "react";
import { settingContentFilteringPage } from "./styles";
import 'react-circular-progressbar/dist/styles.css';
import {
    Switch,
} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
}
export const SettingContentFilteringPage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile,} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const [isSpam, setIsSpam] = useState(false)
    const [isHate, setIsHate] = useState(false)
    const [isNudity, setIsNudity] = useState(false)
    const [isViolence, setIsViolence] = useState(false)
    const [isSexual, setIsSexual] = useState(false)
    const [isOtherNudity, setIsOtherNudity] = useState(false)
    const [isImpersonation, setIsImpersonation] = useState(false)
    const [isSexualHint, setIsSexualHint] = useState(false)


    const { background, table,
    } = settingContentFilteringPage();

  return (
      <main className={background({color:color, isMobile:isMobile})}>
          <Table hideHeader aria-label="Example static collection table" className={table({color:color})}>
              <TableHeader>
                  <TableColumn>Content</TableColumn>
                  <TableColumn>switch</TableColumn>
              </TableHeader>
              <TableBody>
                  <TableRow key="1">
                      <TableCell>露骨な性的な画像・写真</TableCell>
                      <TableCell><Switch defaultSelected={isSexual} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="2">
                      <TableCell>その他のヌードな画像</TableCell>
                      <TableCell><Switch defaultSelected={isOtherNudity} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="3">
                      <TableCell>性的な暗示を含むコンテンツ</TableCell>
                      <TableCell><Switch defaultSelected={isSexualHint} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="4">
                      <TableCell>暴力または血を含むコンテンツ</TableCell>
                      <TableCell><Switch defaultSelected={isViolence} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="5">
                      <TableCell>ヘイトコンテンツ</TableCell>
                      <TableCell><Switch defaultSelected={isHate} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="6">
                      <TableCell>スパム</TableCell>
                      <TableCell><Switch defaultSelected={isSpam} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="7">
                      <TableCell>なりすまし</TableCell>
                      <TableCell><Switch defaultSelected={isImpersonation} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
              </TableBody>
          </Table>
      </main>
  );
}

export default SettingContentFilteringPage;