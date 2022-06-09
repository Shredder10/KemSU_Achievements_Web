import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';
import './Main.css';

import {GetInstitutions} from "./fetch.js";
import {RegisterUser} from "./fetch.js";

let institutesNumber;

function App() {
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Регистрация пользователя</p>
        <RegisterPage />
      </div>
    </div>
  )
}

function RegisterPage() {
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");  
  return (
    <div>
      <p className="Name">
        Email 
        <input id="login" className="Input" type="email" placeholder="example@kemsu.ru" />
        <p hidden={true} className="Error-text" id="email_wrong">Введите корректный адрес почты!</p>
        <p className="Error-text" hidden={true} id="no_email">Укажите адрес электронной почты!</p>
      </p>
      <p className="Name">
        Фамилия 
        <input id="lastName" className="Input" type="text" placeholder="Иванов" />
        <p hidden={true} className="Error-text" id="no_lastName">Введите фамилию пользователя!</p>
      </p>
      <p className="Name">
        Имя 
        <input id="firstName" className="Input" type="text" placeholder="Иван" />
        <p hidden={true} className="Error-text" id="no_firstName">Введите имя пользователя!</p>
      </p>
      <p className="Name">
        Пароль 
        <input id="passwd" className="Input" type="text" placeholder="password" />
        <p hidden={true} className="Error-text" id="no_password">Введите пароль пользователя!</p>
      </p>
      <p className="Name">
        Роль
        <input type="radio" name="newUserRole" id="admin" onChange={function(){document.getElementById("InstitutesSelectView").hidden=true; document.getElementById("InstitutesRadioView").hidden=true;}} /> Администратор
        <input type="radio" name="newUserRole" id="moder" onChange={function(){document.getElementById("InstitutesSelectView").hidden=false; document.getElementById("InstitutesRadioView").hidden=true;}} /> Модератор
        <input type="radio" name="newUserRole" id="dekanat" hidden={true} onChange={function(){document.getElementById("InstitutesSelectView").hidden=true; document.getElementById("InstitutesRadioView").hidden=false;}} /> 
        <p hidden={true} className="Error-text" id="no_role">Выберите роль пользователя!</p>
      </p>
      <p><InstitutesSelectView /></p>
      <p><InstitutesRadioView /></p>
      <p hidden={true} className="Error-text" id="upload_error">{UploadError}</p>
      <p><button className="Button" onClick={function(){Register(setUploadError)}}>Зарегистрировать пользователя</button></p>
    </div>  
  )
}

function InstitutesSelectView() {
  const [Institute, setInstitutes] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await getInstitutions();
        setInstitutes(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Institute===[]) {
    return <div />
  };
  
  return (
    <div hidden={true} id="InstitutesSelectView" style={{'border': '1px solid blue', 'borderRadius': '20px'}}>
      <p className="Name">Выберите институты для работы модератора</p>
      {Institute.map(Institute => (
        <div className="Name">
          <input type="checkbox" id={"Check"+Institute.id} value={Institute.instituteId}/> {Institute.instituteFullName}
        </div>
      ))}
    </div>
  );
}

function InstitutesRadioView() {
  const [Institute, setInstitutes] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await getInstitutions();
        setInstitutes(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Institute===[]) {
    return <div />
  };
  
  return (
    <div hidden={true} id="InstitutesRadioView" style={{'border': '1px solid blue', 'borderRadius': '20px'}}>
      <p className="Name">Выберите институт сотрудника деканата</p>
      {Institute.map(Institute => (
        <div className="Name">
          <input type="radio" id={"Radio"+Institute.id} name="InstitutesRadioView" value={Institute.instituteId}/> {Institute.instituteFullName}
        </div>
      ))}
    </div>
  );
}

async function Register(setUploadError){
    document.getElementById("no_email").hidden=true;
    document.getElementById("no_lastName").hidden=true;
    document.getElementById("no_firstName").hidden=true;
    document.getElementById("no_password").hidden=true;
    document.getElementById("no_role").hidden=true;
    document.getElementById("email_wrong").hidden=true;
    
    if(document.getElementById("login").value=="") {document.getElementById("no_email").hidden=false; return;}
    if(document.getElementById("lastName").value=="") {document.getElementById("no_lastName").hidden=false; return;}
    if(document.getElementById("firstName").value=="") {document.getElementById("no_firstName").hidden=false; return;}
    if(document.getElementById("passwd").value=="") {document.getElementById("no_password").hidden=false; return;}
    if(!document.getElementById("admin").checked && !document.getElementById("moder").checked && !document.getElementById("dekanat").checked) {document.getElementById("no_role").hidden=false; return;} 
    
    
    let re=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(!re.test(document.getElementById("login").value)) {document.getElementById("email_wrong").hidden=false; return;}
    
    let tmp={};
    tmp["email"]=document.getElementById("login").value;
    tmp["firstName"]=document.getElementById("firstName").value;
    tmp["lastName"]=document.getElementById("lastName").value;
    tmp["password"]=document.getElementById("passwd").value;
    
    let institutesList="";
    let role="moderator";
    if(document.getElementById("admin").checked) role="admin";
    else{
      if(document.getElementById("dekanat").checked) {role="dekanat";
        for(let i=0; i<institutesNumber; i++){
          if (document.getElementById("Radio"+i).checked) {institutesList=institutesList+document.getElementById("Radio"+i).value; break;}
        }
      }
      else{
        for(let i=0; i<institutesNumber; i++){
          if (document.getElementById("Check"+i).checked) institutesList=institutesList+document.getElementById("Check"+i).value+",";
        }
        if(institutesList!="") institutesList=institutesList.substring(0, institutesList.length-1);
      }
    }
    
    let request = await RegisterUser(tmp, institutesList, role);
    if(request.status==200) {
      window.location.assign("http://localhost:3000/users/");;
    }
    else {      
        setUploadError(request.message); 
        document.getElementById("upload_error").hidden=false;
    }
}

async function getInstitutions() {
  let institutes=[];  
  let json=await GetInstitutions();
  institutesNumber = json.length;
  
  for(let i=0; i<json.length; i++){
    institutes[i]=json[i];
    institutes[i].id=i;
  }
  return institutes;
}

export default App;