import {useState, Fragment} from "react";
import {useQuery} from "@tanstack/react-query";
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

interface DetailProps {
    data: {
        dto: JejuItem
    }
}

function JejuAttractionDetail() {
    const {contentid} = useParams();
    const nav = useNavigate();
    const {isLoading, isError, error, data} = useQuery<DetailProps, Error>({
        queryKey: ['detail-jeju', contentid],
        queryFn: async() => {
            return await apiClient.get(`/jeju/detail_react/${contentid}`)
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
                                <td className={"text-center"}></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default JejuAttractionDetail