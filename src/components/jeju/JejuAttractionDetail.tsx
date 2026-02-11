import {useState, Fragment, useRef} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {JejuData, JejuItem} from "../../commons/commonsData";
import apiClient from "../../http-commons";
import {AxiosResponse, AxiosError} from "axios";
import  MapPrint from "../../commons/MapPrint";
/*
    1. React = tanstack-query
    2. TypeScript => interface / 데이터형
    3. nodejs => 맛집
    4. 추천 => AI 이용
    5. CRUD = 게시판 / 댓글
              ----- 챗봇
    6. 로그인 처리 : session / cookie => JavaScript
                    ------- JWT
 */
interface CommentData {
    no: number;
    cno: number;
    id: string;
    name: string;
    msg: string;
    dbday: string;
}

interface DetailProps {
    data: {
        dto: JejuItem,
        comments: CommentData[]
    }
}

function JejuAttractionDetail() {
    const {contentid} = useParams();
    const nav = useNavigate();

    const [isInsert, setIsInsert] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [no, setNo] = useState<number>(0);

    // 댓글 작성
    const [msg, setMsg] = useState<string>("");
    const msgRef = useRef<HTMLTextAreaElement>(null);

    // 댓글 수정
    const [umsg, setUmsg] = useState<string>("");
    const umsgRef = useRef<HTMLTextAreaElement>(null);

    const {isLoading, isError, error, data, refetch: jejuDetail} = useQuery<DetailProps, Error>({
        queryKey: ['detail-jeju', contentid],
        queryFn: async() => {
            return await apiClient.get(`/jeju/detail_react/${contentid}`)
        }
    })

    // Comment Insert
    const {mutate: commentInsert} = useMutation<DetailProps>({
        mutationFn: async() => {
            const res: AxiosResponse<DetailProps, Error> = await apiClient.post('/comment/insert', {
                cno: contentid,
                id: sessionStorage.getItem("id"),
                name: sessionStorage.getItem("name"),
                msg: msg
            })

            return res.data
        },
        onSuccess: (data: DetailProps) => {
            jejuDetail()

            if (msgRef.current) {
                msgRef.current.value = ''
            }
        },
        onError: (error: Error) => {
            console.log("Error발생:", error?.message)
        }
    })

    // Comment Delete
    const {mutate: commentDelete} = useMutation<DetailProps>({
        mutationFn: async() => {
            const res: AxiosResponse<DetailProps, Error> = await apiClient.delete(`/comment/delete/${no}/${contentid}`)

            return res.data
        },
        onSuccess: (data: DetailProps) => {
            jejuDetail()
        },
        onError: (error: Error) => {
            console.log("Error발생:", error?.message)
        }
    })

    // Comment Update
    const {mutate: commentUpdate} = useMutation<DetailProps>({
        mutationFn: async() => {
            const res: AxiosResponse<DetailProps, Error> = await apiClient.put('/comment/update', {
                no: no,
                msg: umsg
            })

            return res.data
        },
        onSuccess: (data: DetailProps) => {
            jejuDetail()

            if (umsgRef.current) {
                umsgRef.current.value = ''
            }

            setIsInsert(true)
            setIsEdit(false)
        },
        onError: (error: Error) => {
            console.log("Error발생:", error?.message)
        }
    })

    if (isLoading) {
        return <h1 className={"text-center"}>Loading...</h1>
    }

    if (isError) {
        return <h1 className={"text-center"}>Error발생: {error?.message}</h1>
    }

    const jejuData: JejuItem | undefined = data?.data.dto
    console.log(jejuData)

    const comment: CommentData[] | undefined = data?.data.comments
    console.log(comment)

    // 이벤트 처리
    const insert = () => {
        if (msg === '') {
            msgRef.current?.focus()
            return
        }

        commentInsert()
    }

    const del = (no: number) => {
        setNo(no)
        commentDelete()
    }

    const updateData = (no: number, index: number) => {
        if (!comment) {
            // umsgRef.current.value = comment[index].msg
            return
        }

        setUmsg(comment[index].msg)
        setIsInsert(false)
        setIsEdit(true)
        setNo(no)
    }

    const update = () => {
        if (umsg === '') {
            umsgRef.current?.focus()

            return
        }

        commentUpdate()
    }

    return (
        <Fragment>
            <div className="breadcumb-area" style={{"backgroundImage": "url(../../img/bg-img/breadcumb.jpg)"}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-12">
                            <div className="bradcumb-title text-center">
                                <h2>명소 상세보기</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="breadcumb-nav">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">

                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <section className="archive-area section_padding_80">
                <div className="container">
                    <div className="row">
                        <table className="table">
                            <tbody>
                            <tr>
                                <td className={"text-center"} rowSpan={6} width={"30%"}>
                                    <img src={jejuData?.image1} style={{"width": "350px", "height": "300px"}}/>
                                </td>
                                <td colSpan={2}><h3>{jejuData?.title}</h3></td>
                            </tr>
                            <tr>
                                <td className={"text-center"} width={"15%"}>주소</td>
                                <td width={"55%"}>{jejuData?.address}</td>
                            </tr>
                            <tr>
                                <td className={"text-center"} width={"15%"}>휴무일</td>
                                <td width={"55%"} dangerouslySetInnerHTML={{__html: jejuData?.restdate??""}}></td>
                            </tr>
                            <tr>
                                <td className={"text-center"} width={"15%"}>이용시간</td>
                                <td width={"55%"} dangerouslySetInnerHTML={{__html: jejuData?.usetime??""}}></td>
                            </tr>
                            <tr>
                                <td className={"text-center"} width={"15%"}>주차</td>
                                <td width={"55%"} dangerouslySetInnerHTML={{__html: jejuData?.parking??""}}></td>
                            </tr>
                            <tr>
                                <td className={"text-center"} width={"15%"}>안내</td>
                                {
                                    /* HTML로 파싱 : dangerouslySetInnerHTML */
                                    jejuData?.infocenter && <td width={"55%"} dangerouslySetInnerHTML={{__html: jejuData?.infocenter}}></td>
                                }
                            </tr>
                            </tbody>
                        </table>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>{jejuData?.msg}</td>
                            </tr>
                            </tbody>
                        </table>
                        {/* 지도 */}
                        <table className="table">
                            <tbody>
                            <tr>
                                <td className={"text-center"}>
                                    {
                                        jejuData && <MapPrint address={jejuData?.address} name={jejuData?.title}/>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        {/* 댓글 : CRUD출력 */}
                        <table className="table">
                            <tbody>
                            <tr>
                                <td className={"text-center"}><h3>[댓글]</h3></td>
                            </tr>
                            <tr>
                                <td>
                                    {comment && comment.map((com: CommentData, index: number) =>
                                        <table className="table" key={index}>
                                            <tbody>
                                            <tr>
                                                <td className={"text-left"} width={"80%"}>
                                                    🟣{com.name}({com.dbday})
                                                </td>
                                                <td className={"text-right"} width={"20%"}>
                                                    {
                                                        com.id === sessionStorage.getItem("id") &&
                                                        (
                                                            <span>
                                                                <button className="btn-warning btn-sm" onClick={() => updateData(com.no, index)} key={index}>수정</button>
                                                                &nbsp;
                                                                <button className="btn-warning btn-sm" onClick={() => del(com.no)}>삭제</button>
                                                            </span>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} valign={"top"}>
                                                    <pre style={{"whiteSpace": "pre-wrap", "backgroundColor": "white", "border": "none"}}>{com.msg}</pre>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        {sessionStorage.getItem("id") && isInsert === true && (
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td>
                                        <textarea rows={4} cols={120} style={{"float": "left"}} ref={msgRef} onChange={(e) => setMsg(e.target.value)}/>
                                        <button className={"btn-primary"} style={{"float": "left", "width": "100px", "height": "98px"}} onClick={insert}>댓글 작성</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        )}
                        {isEdit && (
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td>
                                        <textarea rows={4} cols={120} style={{"float": "left"}} ref={umsgRef} value={umsg} onChange={(e) => setUmsg(e.target.value)}/>
                                        <button className={"btn-primary"} style={{"float": "left", "width": "100px", "height": "98px"}} onClick={update}>댓글 수정</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default JejuAttractionDetail