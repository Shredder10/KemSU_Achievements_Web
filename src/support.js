import Sidebar from "./sidebar.js";
import './App.css';
import './Main.css';
import { useState, useEffect } from 'react';
import {GetErrorMessages} from './fetch.js';
import {GetErrorMessageStatuses} from './fetch.js';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <ErrorsListView />
      </div>
    </div>
  )
}

function ErrorsListView() {
  const [Error, setErrors] = useState([]);
  
  useEffect(async () => { //Errors-Default
        async function fetchData() {
        let JSON=await getErrors();
        setErrors(JSON);
    };
    await fetchData();
  }, []);
  
  const [Statuses, setStatuses] = useState([]);
  useEffect(async () => { //Statuses
        async function fetchData() {
        let JSON=await GetErrorMessageStatuses();
        setStatuses(JSON);
    };
    await fetchData();
  }, []);
  
  let ChangeFilter = async (event)=>{
    let FilterId = event.target.value;
    let JSON=await getErrors(FilterId);
    setErrors(JSON);  
  }
  
  if(Error===[]) {
    return <div />
  };
  if (Statuses.length===0) {
    return <div />
  };
  
  return (
  <div>
    <p className="Header">
      Поддержка
    </p>
    <p className="Name">Статус:
      <select id="NewErrorStatus" className="Select" onChange={ChangeFilter}>
        <option key="0" value="">Любой</option>
        {Statuses.map(Statuses => (
          <option key={Statuses.statusErrorId} value={Statuses.statusErrorId}>{Statuses.statusErrorName}</option>
        ))}
      </select>
    </p>
    {Error.map(Error => (
      <button id={Error.errorId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Error.errorId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Error.errorId, 'white')}}>
        <a href={"http://localhost:3000/error-message/"+Error.errorId} style={{'textDecoration': 'none'}} key={Error.errorId}>  
          <div style={{'fontSize': '1.5vh', 'display': 'flex', 'flexDirection': 'column'}}>
            <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{Error.user}</p>
            <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{Error.theme}</p>
            <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{Error.statusErrorName}</p>
          </div>
        </a>  
      </button>
      ))} 
  </div>    
  );
}

async function getErrors(FilterId) {
  let errors=[];  
  let json = await GetErrorMessages(FilterId);
  for(let i=0; i<json.length; i++){
    errors[i]=json[i];
    errors[i].userid=errors[i].user.userId;
    errors[i].user=errors[i].user.firstName+" "+errors[i].user.lastName;
  }
  return errors;
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;