import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';

import {GetUserList} from './fetch.js'
import {GetRoles} from './fetch.js'
import {GetUserStatusesList} from './fetch.js';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Пользователи</p>
        <Userlist />
      </div>
    </div>
  )
}

function Userlist() {
  const [users, setUsers] = useState([]);
  const [Status, setStatuses] = useState([]);
  const [currSubStr, setcurrSubStr] = useState('');
  const [currentRole, setcurrentRole] = useState('');
  const [currentStatus, setcurrentStatus] = useState('');
  
  const [Roles, setRoles] = useState([]);
  useEffect(async () => {  //роли
        async function fetchData() {
        let JSON=await GetRoles();
        setRoles(JSON);
    };
    await fetchData();
  }, []); 
  
  useEffect(async () => {//active-statuses
        async function fetchData() {
        let JSON=await GetUserStatusesList();
        setStatuses(JSON);
    };
    await fetchData();
  }, []); 
  
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetUserList();
        setUsers(JSON);
    };
    await fetchData();
  }, []);  
  
  let ChangeFilter = async (event)=>{
    let FilterId = event.target.value;
    switch(FilterId[0]){
      case "r": {
          if(FilterId[1]!="") {setcurrentRole(FilterId.substring(1)); break;}
          else {setcurrentRole(""); break;}
      }    
      case "t": {
          if(FilterId[1]!="") {setcurrentStatus(FilterId.substring(1)); break;}
          else {setcurrentStatus(""); break;} 
      }    
      default: setcurrSubStr(FilterId);
    }
  }
  
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetUserList(currSubStr, currentRole, currentStatus);
        setUsers(JSON);
    };
    await fetchData();
  }, [currSubStr, currentRole, currentStatus]);
  
  
  if(users===[]) {
    return <div />
  };
  if (Roles.length===0) {
    return <div />
  };
  if (Status.length===0) {
    return <div />
  };
  
  return (
  <div>
    <div>
      <div className="Name">Роль пользователя:
        <select id="NewUserRole" className="Select" onChange={ChangeFilter}>
          <option key="0" value="r">Любая</option>
          {Roles.map(Roles => (
            <option key={Roles.roleId} value={"r"+Roles.roleId}>{Roles.roleName}</option>
          ))}
        </select>
      </div>
      <select className="Select" id="Status" onChange={ChangeFilter}>
        <option key="0" selected="selected" value="t">Статус...</option>
        {Status!=[] && Status.map(Status => (
          <option key={"Status"+Status.statusActiveUserId} value={"t"+Status.statusActiveUserId}>
            {Status.statusActiveUserName}
          </option>
        ))}
      </select>
      <input type="text" className="Input" id="lastName" placeholder="Фамилия" onBlur={ChangeFilter} />
    </div>
    <br />
    <div>
      {users.map(users => (
        <button id={users.userId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(users.userId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(users.userId, 'white')}}>
          <a href={'http://localhost:3000/profile/'+users.userId} style={{'textDecoration': 'none'}}>
            <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{users.firstName} {users.lastName}</p>
            <p style={{'marginBottom': '0.3vh', 'marginTop': '0.3vh'}}>{users.roleName}</p>
          </a>
        </button>
        ))}
    </div>
  </div>
  );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;