import {useState, useRef, useEffect, Fragment} from "react";

interface Message {
    role: "user" | "assistant"
    content: string
}

function ChatBot() {
    // 자체 메시지 목록
    const [message, setMessage] = useState<Message[]>([])
    const [input, setInput] = useState("")

    // AI 메시지를 직접 생성 = HTML에 적용
    const streamingRef = useRef<HTMLDivElement | null>(null)

    // AI가 보내준 데이터를 다 읽었는지 확인
    const isStreaming = useRef(false)

    // 메시지 전송
    const sendMessage = async () => {
        // 1. 입력값 있는 지 체크
        if (!input.trim()) {
            return
        }

        // 2. 사용자 메시지를 state에 추가
        setMessage((prev) => [
            ...prev, // 이전 데이터를 복사
            {role: "user", content: input}, // 사용자가 보낸 메시지
            {role: "assistant", content: ""} // AI가 보낸 메시지
        ])

        const userMessage = input
        setInput("")
        isStreaming.current = true

        // AI가 보낸 데이터를 출력
        try {
            // 1. 서버 연결 => fetch / axios
            // 2. 데이터를 수신 루프
            // 3. DOM 직접 업데이트 => HTML을 생성해서 추가
            // 4. 스트리밍 종료 후 state 반영
            const response = await fetch(
                "http://localhost:8080/chat/stream?message=" + encodeURIComponent(userMessage)
            )
            const reader = response.body!.getReader()
            const decoder = new TextDecoder("utf-8")
            let fullContent = ""

            // 3. 스트리밍 수신 루프
            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }

                const chunk = decoder.decode(value)
                fullContent += chunk.replaceAll("data:"," ")

                // 4. DOM 직접 업데이트 (리렌더 없음)
                if (streamingRef.current) {
                    streamingRef.current.textContent = fullContent
                }
            }

            // 5. 스트리밍 종료 후 state 반영
            setMessage((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                }
                return updated
            })
        } catch(error) {
            console.log(error)
        } finally {
            isStreaming.current = false
        }
    }

    // State에 저장된 데이터 반영
    // => return안에 있는 데이터는 XML {} => if / for => 제어문 사용 금지
    return (
        <Fragment>
            <div className="breadcumb-area" style={{"backgroundImage": "url(../../img/bg-img/breadcumb.jpg)"}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-12">
                            <div className="bradcumb-title text-center">
                                <h2>챗봇</h2>
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
                    <div className="chat-container row" style={{"margin": "0px auto"}}>
                        <div className="header">Spring AI Chat (Stream)</div>
                        <div className="chat-box" id="chatBox">
                            {   message.map((msg, index) => {
                                const isLast = index === message.length - 1;
                                const isAssistant = msg.role === "assistant";

                                return (
                                    <div
                                        key={index}
                                        className={`message ${msg.role}`}
                                    >
                                        <div
                                            className="message-content"
                                            ref={isAssistant && isLast ? streamingRef : null}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="input-area">
                            <div className="input-group">
                                <input type="text" id="messageInput" placeholder="메시지 입력" value={input}
                                       onChange={(e) => setInput(e.target.value)}
                                       onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                                <button id="sendButton" onClick={sendMessage}>전송</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default ChatBot