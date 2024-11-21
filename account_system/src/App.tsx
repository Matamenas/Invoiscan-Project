import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./home";
import Login from "./login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/home"/>}/>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}
export default App;
