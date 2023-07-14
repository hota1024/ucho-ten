import {
    useMuteWords,
    useShowMuteUserInNotifications,
    useShowMuteUserInSearch,
    useDisableScrollOnLoadButtonPress,
} from '@/atoms/settings'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Button,
    Card,
    Col, Dropdown,
    Input,
    Modal,
    Row,
    Spacer,
    Switch,
    Text,
    Textarea,
    Grid,
    Loading,
} from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next"
import { InputSchema as ReportInput } from '@atproto/api/dist/client/types/com/atproto/moderation/createReport'
import {useAgent} from "@/atoms/agent";



/**
 * SetttingsModal props.
 */
export type ReportModalProps = {
    open: boolean
    onClose: () => void
    aturi: string
    postCid: string
}

/**
 * SetttingsModal component.
 */
export const ReportModal = (props: ReportModalProps) => {
    const { open, aturi, postCid, onClose } = props
    const [agent] = useAgent()
    const [reportReasonText, setReportReasonText] = useState<string>('')
    const [reportReasonType, setReportReasonType] = useState<string>('')
    const [isReportSending, setIsReportSending] = useState<boolean>(false)
    const [isReportSuccess, setIsReportSuccess] = useState<boolean | null>(null);
    const reasonList = {
        spam:{reasonType:'com.atproto.moderation.defs#reasonSpam',reason:'スパム行為'},
        sexual:{reasonType:'com.atproto.moderation.defs#reasonSexual',reason:'望まない性的コンテンツ'},
        copyright:{reasonType:'__copyright__',reason:'著作権侵害'},
        rude:{reasonType:'com.atproto.moderation.defs#reasonRude',reason:'反社会的な行動/言動'},
        violation:{reasonType:'com.atproto.moderation.defs#reasonViolation',reason:'緊急性を要する違法行為'},
        other:{reasonType:'com.atproto.moderation.defs#reasonOther',reason:'その他'}
    }
    const reasonTypeToReason = {
        "com.atproto.moderation.defs#reasonSpam":'spam',
        "com.atproto.moderation.defs#reasonSexual":'sexual',
        "__copyright__":'copyRight',
        "com.atproto.moderation.defs#reasonRude":'rude',
        "com.atproto.moderation.defs#reasonViolation":'violation',
        "com.atproto.moderation.defs#reasonOther":'other'
    }

    const { t, i18n } = useTranslation();
    const lngs = {
        ja: "日本語",
        en: "English",
    }
    const lngChange = (lng:any) => {
        i18n.changeLanguage(lng);
        //console.log(i18n.resolvedLanguage)
    }

    const submitReport = async () => {
        setIsReportSending(true)
        try{
            const report = await agent?.createModerationReport({
                reasonType: reportReasonType,
                subject: {
                    $type: 'com.atproto.repo.strongRef',
                    uri: aturi,
                    cid: postCid
                },
                reason: reportReasonText
            })
            setIsReportSending(false)
            console.log(report)
            return report
        }catch (e: any) {
            console.log(e)
            setIsReportSending(false)
            return undefined
        }
    }

    const handleSendButtonPush = async () => {
        //console.log(reportReasonText)
        //console.log(reportReasonType)
        const result = await submitReport()
        if(result?.success){
            setIsReportSuccess(true)
            const _sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
            await _sleep(2000);
            onClose()
        }else{
            setIsReportSuccess(false)
        }

    }
    return (
        <Modal open={open} onClose={onClose} width='450px' style={{left:'2%'}} preventClose={isReportSending}>
            <Modal.Header>
                <Text size="$lg" b>
                    Report
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Row align="center">
                    <Col>
                        <Text>Select a reason</Text>
                    </Col>
                    <Dropdown>
                        <Dropdown.Button light css={{ tt: "capitalize" }}>
                            {reportReasonType ? reasonTypeToReason[reportReasonType as keyof typeof reasonTypeToReason] : "----------"}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            selectionMode="single"
                            disallowEmptySelection
                            selectedKeys={reportReasonType}
                            //@ts-ignore
                            onSelectionChange={(e) => setReportReasonType(reasonList[e.currentKey].reasonType)}
                        >
                            <Dropdown.Item key='spam'>{reasonList.spam.reason}</Dropdown.Item>
                            <Dropdown.Item key='sexual'>{reasonList.sexual.reason}</Dropdown.Item>
                            <Dropdown.Item key='copyright'>{reasonList.copyright.reason}</Dropdown.Item>
                            <Dropdown.Item key='rude'>{reasonList.rude.reason}</Dropdown.Item>
                            <Dropdown.Item key='violation'>{reasonList.violation.reason}</Dropdown.Item>
                            <Dropdown.Item key='other'>{reasonList.other.reason}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
                <Grid.Container>
                    <Grid style={{width:'100%',height:'100%'}}>
                        <Textarea width={'100%'}
                                  minRows={9}
                                  bordered
                                  initialValue={reportReasonText}
                                  status={ reportReasonType === "com.atproto.moderation.defs#reasonOther" && reportReasonText.length == 0 ? 'error' : 'default'}
                                  required={reportReasonType === 'com.atproto.moderation.defs#reasonOther'}
                                  onChange={(e) => {
                                      setReportReasonText(e.target.value)
                                      console.log(e)
                                  }}
                                  placeholder={'Description'}
                        >

                        </Textarea>
                    </Grid>
                </Grid.Container>
            </Modal.Body>
            <Modal.Footer>
                <Grid.Container style={{width:'100%'}} gap={0.2}>
                    <Grid style={{width:'calc((100% - 10px) / 2)'}}>
                        <Button onPress={onClose} flat
                        >
                            {t("Modal.Report.Button.Cancel")}
                        </Button>
                    </Grid >
                    <Grid style={{width:'12px'}}></Grid>
                    <Grid style={{width:'calc((100% - 20px) / 2)'}}>

                        <Button onPress={handleSendButtonPush}
                                flat
                                color={!isReportSending && isReportSuccess ? 'success' : 'error'}
                                disabled={(reportReasonType === "com.atproto.moderation.defs#reasonOther" && reportReasonText.length == 0) || reportReasonType === '' || isReportSending || isReportSuccess ? true : false}
                        >
                            {!isReportSending && isReportSuccess === null&& t("Modal.Report.Button.Send")}
                            {isReportSending && isReportSuccess === null && (<Loading type="points" color="currentColor" size="sm" />)}
                            {!isReportSending && isReportSuccess && 'success!'}
                            {!isReportSending && isReportSuccess === false && 'failed!'}
                        </Button>
                    </Grid>
                </Grid.Container>
            </Modal.Footer>
        </Modal>
    )
}

 const json = {
     "data": {
         "id": 58864,
         "createdAt": "2023-07-14T03:50:29.432Z",
         "reasonType": "com.atproto.moderation.defs#reasonOther",
         "reason": "hoge",
         "reportedBy": "did:plc:txandrhc7afdozk6a2itgltm",
         "subject": {
             "$type": "com.atproto.repo.strongRef",
             "uri": "at://did:plc:owybkbkx7ph76awaqlldeccc/app.bsky.feed.post/3k2exqtfdwt2u",
             "cid": "bafyreiczy2chcgneogdmgv3sxknul4nxop72qx7ienfz6ustavmprzvz74"
         }
     },
     "headers": {
         "content-length": "416",
         "content-type": "application/json; charset=utf-8"
     },
     "success": true
 }