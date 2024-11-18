import './App.css';
import { Routes, Route} from "react-router-dom";
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home';
import Admin from './layouts/Admin';
import { createContext,useState } from "react";

export const LoginContext=createContext();

function App() {
  const [isLoggedIn,setIsLoggedIn]=useState(false)
  const [userId,setUserId]=useState("");
  const [userLevel,setUserLevel]=useState("");
  return (
          <LoginContext.Provider value={{isLoggedIn,setIsLoggedIn,userId,setUserId,userLevel,setUserLevel}}>
            <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            </Routes>
          </LoginContext.Provider>)
}

export default App;
