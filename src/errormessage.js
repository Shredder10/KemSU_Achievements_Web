import Sidebar from "./sidebar.js";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import './Main.css';
import TextareaAutosize from 'react-textarea-autosize';
import {ChangeCommentMessageError} from "./fetch.js";
import {GetErrorMessage} from "./fetch.js";
import {GetErrorMessageStatuses} from "./fetch.js";
import {ChangeStatusError} from "./fetch.js";


function App() {
  let params = useParams();
  let Id=params.id;
  
  const [Error, setError] = useState([]);
  
  useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await getError(Id);
        setError(JSON);
        };
    await fetchData(Id);
    }, []);
  
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Сообщение об ошибке</p>
        <p className="Name">
          Автор:&nbsp;<a href={"http://localhost:3000/profile/"+Error.userid} style={{'textDecoration': 'none'}}>{Error.user}</a>
        </p>
        <p className="Name">Тема: {Error.theme}</p>
        <p className="Name">Сообщение: {Error.description}</p>
        <p id="StatusUpdateError" className="Error-text" hidden={true}>При обновлении произошла ошибка. Повторите попытку или попробуйте позже.</p>
        <p className="Name" id="StatusErrorName" hidden={false}>Статус: {Error.statusErrorName}</p>
        <p className="Name">
          <div id="StatusListView">
            <StatusList id={Id} />
          </div>
        </p>
        <p id="UpdateError" className="Error-text" hidden={true}>При обновлении произошла ошибка. Повторите попытку или попробуйте позже.</p>
        <p className="Name">Комментарий: {Error.comment}</p>
        <p>
          <TextareaAutosize minRows={2} className="Input" id="comment" defaultValue={Error.comment} hidden={true}/>
          <br />
          <button className="Button" id="ChangeComment" onClick={ChangeComment} hidden={false}>Изменить комментарий</button>
          <button className="Button" onClick={function(){UpdateComment(Id)}} hidden={true} id="UpdateComment">Обновить комментарий</button>
        </p>
      </div>
    </div>
  )
}

function ChangeComment() {
  document.getElementById("UpdateComment").hidden = false;
  document.getElementById("comment").hidden = false;
  document.getElementById("ChangeComment").hidden = true;
}

function StatusList(props) {
  const [Statuses, setStatuses] = useState([]);
  
  let Id=props.id;
  
  if (Statuses.length===0) {
    return <button className="Button" onClick={ChangeStatus}>Изменить статус</button>
  };

  async function ChangeStatus() {
    async function fetchData() {
        let JSON=await GetStatusList();
        setStatuses(JSON);
        };
    await fetchData();
  }
  
  document.getElementById("StatusErrorName").hidden=true;

  return (
  <div style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap', 'alignItems': 'center'}}>
    <select id="NewErrorStatus" className="Select">
      {Statuses.map(Statuses => (
        <option key={Statuses.statusErrorId} value={Statuses.statusErrorId}>{Statuses.statusErrorName}</option>
      ))}
    </select>
    <button className="Button" onClick={function () {UpdateStatus(Id)}} id="UpdateStatus">Обновить статус</button>
  </div>
  );
}

async function GetStatusList (){
  let response=await GetErrorMessageStatuses();
  console.log(response);
  return response;
}

async function UpdateComment(Id) {
  document.getElementById("UpdateError").hidden = true;
  let comment = document.getElementById("comment").value;
  
  let tmp={};
  tmp["comment"]=comment;
  tmp["id"]=Id;
  let response = await ChangeCommentMessageError(tmp);
  if (response.status==200) {
    window.location.reload();
  }
  else document.getElementById("UpdateError").hidden = false;
}

async function UpdateStatus(Id) {
  document.getElementById("StatusUpdateError").hidden = true;
  let statusId = document.getElementById("NewErrorStatus").value;
  
  let response = await ChangeStatusError(Id, statusId);
  if (response.status==200) {
    window.location.reload();
  }
  else document.getElementById("StatusUpdateError").hidden = false;
}

async function getError(Id) { 
  let json = await GetErrorMessage(Id);
  json.student=json.student.studentId;
  json.userid=json.user.userId;
  json.user=json.user.firstName+" "+json.user.lastName;
  return json;
}

export default App;