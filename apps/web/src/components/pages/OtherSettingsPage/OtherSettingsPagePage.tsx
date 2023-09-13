import React, {useState, useRef, useCallback, useMemo} from "react";
import { otherSettingsPage } from "./styles";
import 'react-circular-progressbar/dist/styles.css';
import {
    Switch,
} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/react";

interface Props {
    className?: string
    color: 'light' | 'dark'
    isMobile?: boolean
}
export const OtherSettingsPagePage: React.FC<Props> = (props: Props) => {
    const {className, color, isMobile,} = props;
    const reg = /^[\u0009-\u000d\u001c-\u0020\u11a3-\u11a7\u1680\u180e\u2000-\u200f\u202f\u205f\u2060\u3000\u3164\ufeff\u034f\u2028\u2029\u202a-\u202e\u2061-\u2063\ufeff]*$/;
    const [loading, setLoading] = useState(false)
    const [selectedLangKeys, setSelectedLangKeys] = useState(new Set(["日本語"]));
    const selectedLangValue = useMemo(
        () => Array.from(selectedLangKeys).join(", ").replaceAll("_", " "),
        [selectedLangKeys]
    );
    const [selectedTranslateKeys, setSelectedTranslateKeys] = useState(new Set(["日本語"]));
    const selectedTranslateValue = useMemo(
        () => Array.from(selectedTranslateKeys).join(", ").replaceAll("_", " "),
        [selectedTranslateKeys]
    );
    const [isDontQuoteNotif, setIsDontQuoteNotif] = useState(false)
    const [isDontScroll, setIsDontScroll] = useState(false)

    const { background, table,
    } = otherSettingsPage();

  return (
      <main className={background({color:color, isMobile:isMobile})}>
          <Table hideHeader aria-label="Example static collection table" className={table({color:color})}>
              <TableHeader>
                  <TableColumn>Content</TableColumn>
                  <TableColumn>switch</TableColumn>
              </TableHeader>
              <TableBody>
                  <TableRow key="1">
                      <TableCell>テーマカラー</TableCell>
                      <TableCell>
                      </TableCell>
                  </TableRow>
                  <TableRow key="999">
                      <TableCell>
                          <ButtonGroup>
                              <Button>Default</Button>
                              <Button>Light</Button>
                              <Button>Dark</Button>
                          </ButtonGroup>
                      </TableCell>
                      <TableCell>
                      </TableCell>
                  </TableRow>
                  <TableRow key="2">
                      <TableCell>表示言語</TableCell>
                      <TableCell>
                          <Dropdown>
                              <DropdownTrigger>
                                  <Button
                                      variant="bordered"
                                      className="capitalize"
                                  >
                                      {selectedLangValue}
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                  aria-label="Single selection example"
                                  variant="flat"
                                  disallowEmptySelection
                                  selectionMode="single"
                                  selectedKeys={selectedLangKeys}
                                  //@ts-ignore
                                  onSelectionChange={setSelectedLangKeys}
                              >
                                  <DropdownItem key="日本語">日本語</DropdownItem>
                                  <DropdownItem key="English">English</DropdownItem>
                                  <DropdownItem key="한글">한글</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
                      </TableCell>
                  </TableRow>
                  <TableRow key="3">
                      <TableCell>更新した時に上までスクロールしない</TableCell>
                      <TableCell><Switch defaultSelected={isDontScroll} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="4">
                      <TableCell>FF外からの引用ポストを通知しない</TableCell>
                      <TableCell><Switch defaultSelected={isDontQuoteNotif} aria-label="Automatic updates"/></TableCell>
                  </TableRow>
                  <TableRow key="5">
                      <TableCell>ポストの翻訳先言語</TableCell>
                      <TableCell>
                          <Dropdown>
                              <DropdownTrigger>
                                  <Button
                                      variant="bordered"
                                      className="capitalize"
                                  >
                                      {selectedTranslateValue}
                                  </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                  aria-label="Single selection example"
                                  variant="flat"
                                  disallowEmptySelection
                                  selectionMode="single"
                                  selectedKeys={selectedTranslateKeys}
                                  //@ts-ignore
                                  onSelectionChange={setSelectedTranslateKeys}
                              >
                                  <DropdownItem key="日本語">日本語</DropdownItem>
                                  <DropdownItem key="English">English</DropdownItem>
                                  <DropdownItem key="한글">한글</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
                      </TableCell>
                  </TableRow>
              </TableBody>
          </Table>
      </main>
  );
}

export default OtherSettingsPagePage;