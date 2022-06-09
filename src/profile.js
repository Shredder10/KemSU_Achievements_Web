import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';
import TextareaAutosize from 'react-textarea-autosize';

import {GetUserProfile} from "./fetch.js";
import {DeleteUser} from "./fetch.js";
import {GetModerInstitutions} from "./fetch.js";
import {UpdateModerInstitutes} from "./fetch.js";
import {GetInstitutions} from "./fetch.js";
import {ChangeProfileMail} from "./fetch.js";

let institutesNumber;

function App() {
  let params = useParams();
  let Id=params.id;
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <UserProfile id={Id} />
      </div>
    </div>
  )
}

function UserProfile(props) {
  const [ModalActive, setModalActive] = useState(false);
  const [DeleteingUserId, setDeleteingUserId] = useState(0);
  const [DeleteingUserName, setDeleteingUserName] = useState(0);
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  
  const [user, setUser] = useState([]);
  let Id=props.id;
  
    useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await GetUserProfile(Id);
        setUser(JSON);
        };
    await fetchData(Id);
    }, []);
    
  return (
    <div>
      <p className="Header">{user.lastName} {user.firstName}</p>
      <p className="Name">Статус: {user.statusUser}</p>
      <p className="Name">Роль: {user.roleName}</p>
      <p className="Name">Дата регистрации: {user.dateRegistration}</p>
      {user.email!=" " && <p className="Name">email: {user.email}</p>}
      {Id == localStorage.getItem("userId") &&
      <p>
        <TextareaAutosize minRows={2} className="Input" id="mailTextarea" defaultValue={user.email} hidden={true}/>
        <br />
        <button className="Button" id="ChangeEmail" onClick={ChangeMail} hidden={false}>Изменить почту</button>
        <button className="Button" onClick={function(){UpdateMail(setUploadError)}} hidden={true} id="UpdateEmail">Обновить почту</button>
        <p id="MailUpdateError" className="Error-text" hidden={true}>{UploadError}</p>
      </p>
      }
      {user.roleName=="Модератор" &&
        <InstituteListModer id={Id} />    
      }
      {Id!==localStorage.getItem("userId") && user.roleName!=="Администратор" && user.statusUser!=="Аннигилирован" &&
        <button id={"delete"+user.userId} className="Button" onClick={function(){setDeleteingUserId(user.userId); setDeleteingUserName(user.firstName+" "+user.lastName); setModalActive(true);}} onMouseOver={function(){ChangeBackgroundColor("delete"+user.userId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("delete"+user.userId, 'white')}}>Удалить пользователя</button>
      }
      <Modal Active={ModalActive} setActive={setModalActive} userId={DeleteingUserId} userName={DeleteingUserName}/>
    </div>  
  )
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

function InstituteListModer(props) {
  let Id=props.id;
  const [Institute, setInstitutes] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetModerInstitutions(Id);
        setInstitutes(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Institute===[]) {
    return <div />
  };
  
  return (
    <div>
      <p className="Name">Список институтов модератора:</p>
      <ul id="InstitutesSelectView">
      {Institute.map(Institute => (
        <li className="Name">{Institute.instituteFullName}</li>
      ))}
      </ul>
      {localStorage.getItem("userRole")=="Администратор" &&
        <div>
          <button id="edit" className="Button" onClick={function(){document.getElementById("InstitutesSelect").hidden=false;}} onMouseOver={function(){ChangeBackgroundColor("edit", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("edit", 'white')}}>Изменить список институтов</button>
          <p><InstitutesSelectView id={Id} /></p>
        </div>
      }
    </div>  
  );
}

function InstitutesSelectView(props) {
  const [Institute, setInstitutes] = useState([]);
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  let Id=props.id;
  
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
    <div hidden={true} id="InstitutesSelect" style={{'border': '1px solid blue', 'borderRadius': '20px'}}>
      <p className="Name">Укажите институты для работы модератора</p>
      {Institute.map(Institute => (
        <div className="Name">
          <input type="checkbox" id={"Check"+Institute.id} value={Institute.instituteId}/> {Institute.instituteFullName}
        </div>
      ))}
      <p hidden={true} className="Error-text" id="upload_error">{UploadError}</p>
      <button id="update" className="Button" onClick={function(){UpdateInstitutes(setUploadError, Id)}} onMouseOver={function(){ChangeBackgroundColor("update", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("update", 'white')}}>Обновить список институтов</button>
    </div>
  );
}

async function UpdateInstitutes(setUploadError, userId){
    let institutesList="";
    for(let i=0; i<institutesNumber; i++){
      if (document.getElementById("Check"+i).checked) institutesList=institutesList+document.getElementById("Check"+i).value+",";
    }
    if(institutesList!="") institutesList=institutesList.substring(0, institutesList.length-1);
    
    let request = await UpdateModerInstitutes(userId, institutesList);
    if(request.status==200) {
      window.location.reload();;
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

const Modal = ({Active, setActive, userId, userName}) => {
  const [ModalErrorHidden, setModalErrorHidden] = useState(true);
  const [ModalErrorMessage, setModalErrorMessage] = useState("");
  
  
  let del = async (event)=>{    
    setModalErrorMessage("");
    setModalErrorHidden(true);
    
    let JSON=await DeleteUser(userId); 
    console.log(JSON);
    if (JSON.status==200) {window.location.assign("http://localhost:3000/users");}
    else {
        setModalErrorMessage(JSON.message);
        setModalErrorHidden(false);
    }
  }
    
  return(
    <div className={Active ? "Modal Active" : "Modal"} onClick={() => {setActive(false); setModalErrorMessage(JSON.message); setModalErrorHidden(true);}}>
      <div className="ModalContent" onClick={e => e.stopPropagation()}>
        <p>Вы действительно хотите удалить пользователя "{userName}"? Это действие нельзя отменить!</p>
        <p hidden={ModalErrorHidden}>{ModalErrorMessage}</p>
        <div className="List-String">
          <button id={"deleteYes"} className="List-Element" onClick={() => del()} onMouseOver={function(){ChangeBackgroundColor("deleteYes", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("deleteYes", 'white')}}>
            <p>Удалить</p>
          </button>
          <button id={"deleteNo"} className="List-Element" onClick={() => {setActive(false); setModalErrorMessage(JSON.message); setModalErrorHidden(true);}} onMouseOver={function(){ChangeBackgroundColor("deleteNo", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("deleteNo", 'white')}}>
            <p>Вернуться</p>
          </button>
       </div>
      </div>
    </div>
  )
}

function ChangeMail() {
  document.getElementById("UpdateEmail").hidden = false;
  document.getElementById("mailTextarea").hidden = false;
  document.getElementById("ChangeEmail").hidden = true;
}

async function UpdateMail(setUploadError) {
  document.getElementById("MailUpdateError").hidden = true;
  let email = document.getElementById("mailTextarea").value;
  
  let response = await ChangeProfileMail(email);
  if (response.status==200) {
    window.location.reload();
  }
  else {
    setUploadError(response.message);
    document.getElementById("MailUpdateError").hidden = false;
  }
}

export default App;