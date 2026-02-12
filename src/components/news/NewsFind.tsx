import {useState, Fragment, useRef} from "react";
import {useQuery} from "@tanstack/react-query";
import boardClient from "../../board-commons";
import {YoutubeItem} from "../../commons/commonsData";
import {AxiosResponse} from "axios";
/*
	"lastBuildDate":"Thu, 12 Feb 2026 14:30:45 +0900",
	"total":227373,
	"start":1,
	"display":10,
	"items":[
		{
			"title":"한파·설연휴·15분 만두떡국·<b>박스오피스<\/b> TOP5·AI... ",
			"link":"https:\/\/gnhong.com\/m\/6435",
			"description":"만두떡국·<b>박스오피스<\/b> TOP5·AI 데이터센터… 세널리 데일리(2026-01-23) 세널리 2026. 1. 23. 13:19 세널리 데일리 · 2026-01-23 (금) | 일상 인사이트 &amp; 취향 레시피 · 패션 · 음악 · AI · <b>박스오피스<\/b> 한파·설연휴... ",
			"bloggername":"홍준일이 말합니다.",
			"bloggerlink":"https:\/\/gnhong.com\/",
			"postdate":"20260123"
		}
 */

interface NewsItem {
    title: string,
    originallink: string,
    link: string,
    description: string,
    pubDate: string
}

interface NewsResponse {
    lastBuildDate: string,
    total: number,
    start: number,
    display: number,
    items: NewsItem[]
}

interface NewsProps {
    data: NewsResponse
}

function NewsFind() {
    const [fd, setFd] = useState<string>("여행")

    const fdRef = useRef<HTMLInputElement>(null);

    // 서버 연결
    const {isLoading, isError, error, data, refetch: newsFind} = useQuery<AxiosResponse, Error>({
        queryKey: ['news-find'],
        queryFn: async () => await boardClient.get(`/news/find_node?query=${fd}`)
    })

    const find = () => {
        if (!fd.trim()) {
            return fdRef.current?.focus()
        }

        if (fdRef.current) {
            setFd(fdRef.current?.value)
        }

        newsFind()
    }

    if (isLoading) {
        return <h1 className="text-center">Loading...</h1>
    }

    if (isError) {
        return <h1 className="text-center">Error:{error?.message}</h1>
    }

    return (
        <Fragment>
            <div className="breadcumb-area" style={{"backgroundImage": "url(../../img/bg-img/breadcumb.jpg)"}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-12">
                            <div className="bradcumb-title text-center">
                                <h2>뉴스 검색</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="breadcumb-nav">
                <div className="container">
                    <div className="row">
                        <div className="col-12" style={{"marginTop": "20px"}}>
                            <input type={"text"} size={20} className={"input-sm"} ref={fdRef} value={fd}
                                   onChange={e => setFd(e.target.value)} />
                            &nbsp;
                            <button className={"btn-sm btn-primary"} onClick={find}>검색</button>
                        </div>
                    </div>
                </div>
            </div>
            <section className="archive-area section_padding_80">
                <div className="container">
                    <div className="row" style={{"width": "800px", "margin": "0px auto"}}>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>
                                    {data?.data.items && data?.data.items.map((item: NewsItem) =>
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td><a href={item.link} target="_blank" ><h4 style={{"color": "orange"}} dangerouslySetInnerHTML={{__html: item.title}}></h4></a></td>
                                            </tr>
                                            <tr>
                                                <td dangerouslySetInnerHTML={{__html: item.description}}></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    )}
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

export default NewsFind;