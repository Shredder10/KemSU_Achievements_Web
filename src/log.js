import Sidebar from "./sidebar.js";
import './App.css';
import './Main.css';
import { useState, useEffect } from 'react';

import {GetLogList} from "./fetch.js";
import {GetOperationTypes} from "./fetch.js";
import {GetRoles} from "./fetch.js";


function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <LogListView />
      </div>
    </div>
  )
}

function LogListView() {
  const [Log, setLog] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetLogList();
        setLog(JSON);
    };
    await fetchData();
  }, []); 
  
  const [Types, setTypes] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetOperationTypes();
        setTypes(JSON);
    };
    await fetchData();
  }, []); 
  
  const [Roles, setRoles] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetRoles();
        setRoles(JSON);
    };
    await fetchData();
  }, []); 
  
  let currentOperation="";
  let currentRole="";
  let ChangeFilter = async (event)=>{
    let FilterId = event.target.value;
    if(FilterId[0]=="r") currentRole=FilterId.substring(4);
    else currentOperation=FilterId.substring(4);
    let JSON=await GetLogList(currentOperation, currentRole);
    setLog(JSON);  
  }
  
  if(Log===[]) {
    return <div />
  };
  if (Types.length===0) {
    return <div />
  };
  if (Roles.length===0) {
    return <div />
  };
  
  return (
  <div>
    <p className="Header">
      Лог
    </p>
    
    {localStorage.getItem("userRole")=='Администратор' &&
    <div>
      <p className="Name">Тип операции:
        <select id="NewOperationType" className="Select" onChange={ChangeFilter}>
          <option key="0" value="type">Любой</option>
          {Types.map(Types => (
            <option key={Types.operationId} value={"type"+Types.operationId}>{Types.operationName}</option>
          ))}
        </select>
      </p>
      <p className="Name">Роль пользователя:
        <select id="NewUserRole" className="Select" onChange={ChangeFilter}>
          <option key="0" value="role">Любая</option>
          {Roles.map(Roles => (
            <option key={Roles.roleId} value={"role"+Roles.roleId}>{Roles.roleName}</option>
          ))}
        </select>
      </p>
    </div>
    }

        <div className="List-Column">
          {Log.map(Log => (
            <div key={Log.logId}>
            <button id={Log.logId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Log.logId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Log.logId, 'white')}}>
              <a href={"http://localhost:3000/logmessage/"+Log.logId} style={{'textDecoration': 'none'}}>  
                <div id={Log.logId} style={{'fontSize': '1.5vh', 'display': 'flex', 'flexDirection': 'column'}}>
                  <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{Log.operationName} -> {Log.newData}</p>
                  <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{Log.changeDate}</p>
                </div>
              </a> 
            </button>
            </div>
          ))}
        </div>
  </div>
  );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;