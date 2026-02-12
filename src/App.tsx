import Header from "./components/layout/Header";
import Home from "./components/layout/Home";
import Footer from "./components/layout/Footer";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import JejuAttractionList from "./components/jeju/JejuAttractionList";
import JejuAttractionDetail from "./components/jeju/JejuAttractionDetail";
import BoardList from "./components/board/BoardList";
import BoardInsert from "./components/board/BoardInsert";
import BoardDetail from "./components/board/BoardDetail";
import BoardUpdate from "./components/board/BoardUpdate";
import BoardDelete from "./components/board/BoardDelete";
import YoutubeFind from "./components/youtube/YoutubeFind";
import ChatBot from "./components/chat/ChatBot";
import NewsFind from "./components/news/NewsFind";

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/jeju/attraction" element={<JejuAttractionList/>}/>
                <Route path="/jeju/detail/:contentid" element={<JejuAttractionDetail/>}/>
                <Route path="/board/list" element={<BoardList/>}/>
                <Route path="/board/insert" element={<BoardInsert/>}/>
                <Route path="/board/detail/:no" element={<BoardDetail/>}/>
                <Route path="/board/update/:no" element={<BoardUpdate/>}/>
                <Route path="/board/delete/:no" element={<BoardDelete/>}/>
                <Route path="/youtube/find" element={<YoutubeFind/>}/>
                <Route path="/chat/chatbot" element={<ChatBot/>}/>
                <Route path="/news/find" element={<NewsFind/>}/>
            </Routes>
            <Footer/>
        </Router>
    );
}

export default App;
