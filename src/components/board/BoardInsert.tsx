import {useState, useEffect, useRef, Fragment} from 'react';
import {useQuery, useMutation} from "@tanstack/react-query";
import boardClient from "../../board-commons"; // 서버 연결
import {useNavigate} from "react-router-dom"; // 화면 이동
/*
    useQuery = SELECT
    useMutation = INSERT UPDATE DELETE
 */
function BoardInsert() {
    const nav = useNavigate();
    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");

    const nameRef = useRef<HTMLInputElement>(null)
    const subjectRef = useRef<HTMLInputElement>(null)
    const pwdRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)

    const {mutate: boardInsert} = useMutation({
        mutationFn: async () => {
            return await boardClient.post('/board/insert_node', {
                name: name,
                subject: subject,
                content: content,
                pwd: pwd
            })
        },
        onSuccess: (res) => {
            if (res.data.msg === 'yes') {
                window.location.href = '/board/list'
            } else {
                alert('게시판 등록 실패\n★★★돌아가★★★')
            }
        },
        onError: (err: Error) => {
            console.log("Error발생:", err.message)
        }
    })

    // 이벤트 처리
    const insert = (): void => {
        if(!name.trim()) {
            return nameRef.current?.focus()
        }
        if(!subject.trim()) {
            return subjectRef.current?.focus()
        }
        if(!content.trim()) {
            return contentRef.current?.focus()
        }
        if(!pwd.trim()) {
            return pwdRef.current?.focus()
        }

        boardInsert()
    }

    return (
        <Fragment>
            <div className="breadcumb-area" style={{"backgroundImage": "url(../../img/bg-img/breadcumb.jpg)"}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-12">
                            <div className="bradcumb-title text-center">
                                <h2>React-Query + TypeScript 글쓰기</h2>
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
                    <div className="row" style={{"width": "600px", "margin": "0px auto"}}>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td width={"15%"} className={"text-center"}>이름</td>
                                <td width={"85%"}>
                                    <input type={"text"} size={15} className={"input-sm"} ref={nameRef} value={name}
                                           onChange={(e: any):void => setName(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td width={"15%"} className={"text-center"}>제목</td>
                                <td width={"85%"}>
                                    <input type={"text"} size={55} className={"input-sm"} ref={subjectRef} value={subject}
                                           onChange={(e: any):void => setSubject(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td width={"15%"} className={"text-center"}>내용</td>
                                <td width={"85%"}>
                                    <textarea rows={10} cols={55} ref={contentRef} value={content}
                                              onChange={(e: any):void => setContent(e.target.value)}></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td width={"15%"} className={"text-center"}>비밀번호</td>
                                <td width={"85%"}>
                                    <input type={"password"} size={15} className={"input-sm"} ref={pwdRef} value={pwd}
                                           onChange={(e: any):void => setPwd(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className={"text-center"}>
                                    <button className={"btn-primary btn-sm"} onClick={insert}>글쓰기</button>
                                    &nbsp;
                                    <button className={"btn-danger btn-sm"} onClick={() => nav(-1)}>취소</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default BoardInsert