import './App.css';
import { Routes, Route} from "react-router-dom";
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home';

function App() {
  return (<Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/home" element={<Home />}></Route>
          </Routes>)
}

export default App;
