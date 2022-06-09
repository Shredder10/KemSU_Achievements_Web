import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';
import './Main.css';
import {GetProofFiles} from "./fetch.js";
import {GetAchievementProof} from "./fetch.js";
import {GetAchievementProofStatusList} from "./fetch.js";
import {SetProofStatus} from "./fetch.js";
import {SetProofComment} from "./fetch.js";

import TextareaAutosize from 'react-textarea-autosize';

function App() {
  let params = useParams();
  let Id=params.id;
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <Achievement id={Id} />
      </div>
    </div>
  )
}

function Achievement(props) {
  const [state, setState] = useState({achievement: {achieveId: "", achieveName: "", file: "", description: "", statusActive: ""}, comment: "", dateProof: "", listFile: "", proofId: "", statusRequestName: "", student: "", user: {firstName: "", lastName: "", userId: ""}});
  
  const [UpdateError, setUpdateError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  const [StatusUpdateError, setStatusUpdateError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  
  let Id=props.id;
  
  useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await GetAchievementProof(Id);

        setState(state => ({ ...state, achievement: {achieveId: JSON.achievement.achieveId, achieveName: JSON.achievement.achieveName, file: JSON.achievement.file, description: JSON.achievement.description, statusActive: JSON.achievement.statusActive}, comment: JSON.comment, dateProof: JSON.dateProof, listFile: JSON.listFile.listFileId, proofId: JSON.proofId, statusRequestName: JSON.statusRequestName, student: JSON.student, user: {firstName: JSON.user.firstName, lastName: JSON.user.lastName, userId: JSON.user.userId}}));
        };
        
    await fetchData(Id);
    }, []);
  
  if(state.proofId==="") {
    return <div />
  };

  return (
    <div className="UserProfile" >
      <p className="Header">Заявка на получение достижения</p>
      <p style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap', 'alignItems': 'center'}}>
        <button className="Button">
          <a href={'http://localhost:3000/profile/'+state.user.userId} style={{'textDecoration': 'none'}}>
            {state.user.lastName} {state.user.firstName}
          </a>
        </button>
       <p className="Name">-</p>
        <button className="Button">
          <a href={'http://localhost:3000/achievements/'+state.achievement.achieveId} style={{'textDecoration': 'none'}}>
            {state.achievement.achieveName}
          </a>
        </button>
      </p>
      <p className="Header">ПОДТВЕРЖДЕНИЕ</p>
      <p>
        <ProofFiles files={state.listFile} />
      </p>
      <p className="Name">Дата формирования заявки: {state.dateProof}</p>
      <p id="UpdateError" hidden={true}>При обновлении произошла ошибка. Повторите попытку или попробуйте позже.</p>
      <p><TextareaAutosize minRows={2} className="Input" id="comment" readOnly="readonly" defaultValue={state.comment}/></p>
      <p id="StatusUpdateError" hidden={true}>При обновлении произошла ошибка. Повторите попытку или попробуйте позже.</p>
        <button className="Button" onClick={ChangeComment}>Изменить комментарий</button>
        <button className="Button" onClick={function () {UpdateComment(Id, setUpdateError)}} hidden={true} id="UpdateComment">Обновить комментарий</button>
        
      <p className="Name">Статус: {state.statusRequestName}</p>
      <div id="StatusListView"><StatusList id={Id} setStatusUpdateError={setStatusUpdateError} /></div>
    </div>  
  )
}

function ChangeComment() {
  document.getElementById("comment").readOnly = false;
  document.getElementById("UpdateComment").hidden = false;
}

function StatusList(props) {
  const [Statuses, setStatuses] = useState([]);
  let Id=props.id;

  if (Statuses.length===0) {
    return <button className="Button" onClick={ChangeStatus}>Изменить статус</button>
  };

  async function ChangeStatus() {
    async function fetchData() {
        let JSON=await GetAchievementProofStatusList();
        setStatuses(JSON);
        };
    await fetchData();
  }
  
  return (
  <div>
    <button className="Button" onClick={ChangeStatus}>Изменить статус</button>
    <select className="Select" id="NewErrorStatus" value={Statuses.statusRequestId}>
      {Statuses.map(Statuses => (
        <option key={Statuses.statusRequestId} value={Statuses.statusRequestId}>{Statuses.statusRequestName}</option>
      ))}
    </select>
    <button className="Button" onClick={function () {UpdateStatus(Id, props.setStatusUpdateError)}} id="UpdateStatus">Обновить статус</button>
  </div>
  );
}

async function UpdateStatus(Id, setStatusUpdateError) {
  document.getElementById("StatusUpdateError").hidden = true;
  let statusId = document.getElementById("NewErrorStatus").value;
  let request = await SetProofStatus(Id, statusId);
  if (request.status == 200) {
    window.location.reload();
  }
  else {
      setStatusUpdateError(request.message); 
      document.getElementById("StatusUpdateError").hidden = false;
  }
}

async function UpdateComment(Id, setUpdateError) {
  document.getElementById("UpdateError").hidden = true;
  let comment = document.getElementById("comment").value;
  let tmp={};
  tmp["comment"]=comment;
  tmp["id"]=Id;
  
  let request=await SetProofComment(tmp);
  if (request.status == 200) {
    window.location.reload();
  }
  else {
    setUpdateError(request.message);  
    document.getElementById("UpdateError").hidden=false;
  }
}

function ProofFiles(Id){
  const [Files, setFiles] = useState([]);
  useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await GetProofFiles(Id);
        let files = [];
        for(let i=0; i<JSON.length; i++){
            let id = i;
            let data='data:application/'+JSON[i].format+';base64,'+atob(JSON[i].data);
            let filename='Файл подтверждения.'+JSON[i].format;
            files[i] = [id, data, filename];
        }
        setFiles(files);
    };
    await fetchData(Id.files);
  }, []); 
  
  if(Files===[]) {
    return <div />
  };
  
  //console.log(Files);
  return (
    <ul>
    {Files.map(Files => (
        <li key={Files[0]}>
          <a href={Files[1]} download={Files[2]}>Файл подтверждения</a>
        </li>
      ))}
    </ul>
  );
}

export default App;