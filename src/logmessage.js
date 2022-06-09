import Sidebar from "./sidebar.js";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import './Main.css';

import {GetLog} from "./fetch.js";

function App() {
  let params = useParams();
  let Id=params.id;
  
  const [state, setState] = useState([]);
  
  useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await GetLog(Id);
        setState(JSON);
        };
    await fetchData(Id);
    }, []);
  
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Запись лога</p>
        <p className="Name">Тип операции: {state.operationName}</p>
        <p className="Name">Изменение: {state.oldData} -> {state.newData}</p>
        <p className="Name">Дата операции: {state.changeDate}</p>
      </div>
    </div>
  )
}

export default App;