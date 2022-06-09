import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';
import TextareaAutosize from 'react-textarea-autosize';
import {GetStudent} from "./fetch.js";
import {BanStudent} from "./fetch.js";
import {DeleteStudent} from "./fetch.js";

function App() {
  let params = useParams();
  let Id=params.id;
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <StudentProfile id={Id} />
      </div>
    </div>
  )
}

function StudentProfile(props) {
  const [student, setStudent] = useState([]);
  const [ModalActive, setModalActive] = useState(false);
  const [ModalDeleteActive, setModalDeleteActive] = useState(false);
  let Id=props.id;
  
    useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await GetStudent(Id);
        setStudent(JSON);
        };
    await fetchData(Id);
    }, []);
    
  if(student==""){
    return <div />
  }      
  
  return (
    <div className="List-Column">
      <div className="List-String">
        <div className="List-Column">
          <p className="Name">{student.firstName} {student.lastName}</p>
          <img src={"data:image/"+student.format+";base64,"+atob(student.data)} height="200vh" className="Name" width="200vh"  alt="Изображение профиля"/>
          {localStorage.getItem("userRole")=="Модератор" && 
            <div className="List-Column">
              <button className="Button" id="ban" onClick={function(){setModalActive(true);}} onMouseOver={function(){ChangeBackgroundColor("ban", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("ban", 'white')}}>Забанить студента</button>
              <button className="Button" id="delete" onClick={function(){setModalDeleteActive(true);}} onMouseOver={function(){ChangeBackgroundColor("delete", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("delete", 'white')}}>Удалить студента</button>
            </div>  
          }
        </div>
        <div className="List-Column">
          <br />
          <p className="Name" style={{'fontSize': '2.5vh'}}>Группа: {student.streamFullName}, {student.groupName}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Институт: {student.instituteFullName}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Статус: {student.statusUser}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>email: {student.email}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Дата регистрации: {student.dateRegistration}</p>
        </div>
      </div>
      <Modal Active={ModalActive} setActive={setModalActive} studentId={Id} studentName={student.firstName+" "+student.lastName}/>
      <ModalDelete Active={ModalDeleteActive} setActive={setModalDeleteActive} studentId={Id} studentName={student.firstName+" "+student.lastName}/>
    </div>   
  )
}

const Modal = ({Active, setActive, studentId, studentName}) => {
  const [ModalErrorHidden, setModalErrorHidden] = useState(true);
  const [ModalErrorMessage, setModalErrorMessage] = useState("");
  
  
  let del = async (event)=>{    
    setModalErrorMessage("");
    setModalErrorHidden(true);
    document.getElementById("noEndDate").hidden=true;
    document.getElementById("noReason").hidden=true;
    
    let tmp={};
    if(document.getElementById("banEndDate").value=="") {document.getElementById("noEndDate").hidden=false; return;}
    tmp.banDateEnd=document.getElementById("banEndDate").value;
    if(document.getElementById("Reason").value=="") {document.getElementById("noReason").hidden=false; return;}
    tmp.banReason=document.getElementById("Reason").value;
    tmp.studentId=studentId;
    
    let JSON=await BanStudent(tmp); 
    if (JSON.status==200) {window.location.reload();}
    else {
        setModalErrorMessage(JSON.message);
        setModalErrorHidden(false);
    }
  }
    
  return(
    <div className={Active ? "Modal Active" : "Modal"} onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}}>
      <div className="ModalContent Ban" onClick={e => e.stopPropagation()}>
        <p className="Name">Блокировка студента {studentName}</p>
        <p className="Name">
          Причина
          <TextareaAutosize id="Reason" className="Input" placeholder="Причина" />
        </p>
        <p hidden={true} className="Error-text" id="noReason">Укажите причину блокировки.</p>
        <div>
          <p className="Name">Дата окончания блокировки</p>
          <input className="Button" id="banEndDate" type="date" />
        </div>
        <p hidden={true} className="Error-text" id="noEndDate">Укажите дату окончания блокировки.</p>
        <p hidden={ModalErrorHidden}>{ModalErrorMessage}</p>
        <div className="List-String">
          <button id={"banYes"} className="Button" onClick={() => del()} onMouseOver={function(){ChangeBackgroundColor("banYes", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("banYes", 'white')}}>
            Заблокировать
          </button>
          <button id={"banNo"} className="Button" onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}} onMouseOver={function(){ChangeBackgroundColor("banNo", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("banNo", 'white')}}>
            Вернуться
          </button>
       </div>
      </div>
    </div>
  )
}

const ModalDelete = ({Active, setActive, studentId, studentName}) => {
  const [ModalErrorHidden, setModalErrorHidden] = useState(true);
  const [ModalErrorMessage, setModalErrorMessage] = useState("");
  
  
  let del = async (event)=>{    
    setModalErrorMessage("");
    setModalErrorHidden(true);
    
    let JSON=await DeleteStudent(studentId); 
    if (JSON.status==200) {window.location.reload();}
    else {
        setModalErrorMessage("Произошла ошибка при удалении. Попробуйте снова.");
        setModalErrorHidden(false);
    }
  }
    
  return(
    <div className={Active ? "Modal Active" : "Modal"} onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}}>
      <div className={ModalErrorMessage=="" ? "ModalContent Small" : "ModalContent Big"} onClick={e => e.stopPropagation()}>
        <p>Вы действительно хотите удалить студента ({studentName}) без возможности восстановления ? Это действие нельзя отменить!</p>
        <p hidden={ModalErrorHidden}>{ModalErrorMessage}</p>
        <div className="List-String">
          <button id={"deleteYes"} className="Button" onClick={() => del()} onMouseOver={function(){ChangeBackgroundColor("deleteYes", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("deleteYes", 'white')}}>
            Удалить
          </button>
          <button id={"deleteNo"} className="Button" onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}} onMouseOver={function(){ChangeBackgroundColor("deleteNo", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("deleteNo", 'white')}}>
            Вернуться
          </button>
       </div>
      </div>
    </div>
  )
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;