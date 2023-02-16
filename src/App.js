import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import Join from "./pages/Join";
import Login from "./pages/Login";
import InsertPost from "./pages/InsertPost";
import UpdatePost from "./pages/UpdatePost";
import My from "./pages/My";
import ChangeInfo from "./pages/ChangeInfo";
import Error404 from "./pages/Error404";
import MyNavbar from "./components/common/MyNavbar";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Posts />} />
          {/* /post/1 */}
          <Route path='/post/:idx' element={<Post />} />
          <Route path='/join' element={<Join />} />
          <Route path='/login' element={<Login />} />
          <Route path='/insert-post' element={<InsertPost />} />
          <Route path='/update-post' element={<UpdatePost />} />
          <Route path='/my' element={<My />} />
          <Route path='/change-info' element={<ChangeInfo />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
